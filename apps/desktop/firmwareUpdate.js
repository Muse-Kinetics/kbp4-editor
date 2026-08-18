// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

'use strict';

//
// firmwareUpdate.js — Windows-only. K-Board Pro 4 firmware updates over
// WebMIDI/Chromium can't safely sub-split a SysEx transfer the way this
// device's bootloader requires (see /firmware/kbp4-firmware-update-process.md
// at the repo root for the full why). On Windows the desktop editor instead
// shells out to a bundled copy of `sendsysex` (github.com/Muse-Kinetics/sendsysex),
// which talks to WinMM/WMS directly and already implements the required
// transfer shape.
//
// Only ever require()'d/used from index.js behind a process.platform==='win32'
// check — macOS keeps its existing WebMIDI-based flow completely untouched.
//

const path = require('path');
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

function sendSysExDir() {
  // Packaged: shipped via build.win.extraResources (see package.json) into
  // <install-dir>/resources/sendsysex, outside app.asar (must be a real file
  // on disk to exec). Dev/unpacked: straight from this folder's resources/.
  return app.isPackaged
    ? path.join(process.resourcesPath, 'sendsysex')
    : path.join(__dirname, 'resources', 'sendsysex');
}

let updateWindow = null;
let updateProcess = null;

function openUpdateWindow(parentWindow) {
  updateWindow = new BrowserWindow({
    width: 720,
    height: 560,
    parent: parentWindow,
    modal: true,
    resizable: true,
    minimizable: false,
    maximizable: false,
    title: 'K-Board Pro 4 Firmware Update',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'firmwareUpdatePreload.js'),
    },
  });
  updateWindow.setMenuBarVisibility(false);
  updateWindow.loadFile(path.join(__dirname, 'firmwareUpdateWindow.html'));

  // Block closing the window while sendsysex is still running, so the
  // transfer can't get interrupted by an accidental click — mirrors the
  // "press any key to close" idea, but as a real disabled-until-done window
  // rather than a raw console box.
  updateWindow.on('close', (event) => {
    if (updateProcess && updateProcess.exitCode === null && !updateProcess.killed) {
      event.preventDefault();
    }
  });
  updateWindow.on('closed', () => {
    updateWindow = null;
  });

  return updateWindow;
}

// Starts a `--fw-update KBP4` run in a dedicated window, streaming sendsysex's
// real stdout/stderr verbatim (no parsing — see the review that led to this:
// sendsysex's own output format is still actively changing upstream, so
// trusting only its process exit code is the one thing safe to automate on).
// onDone(code) fires once the process exits, code===0 meaning success.
function startFirmwareUpdate(parentWindow, onDone) {
  if (process.platform !== 'win32') return;
  if (updateProcess) return; // already running, ignore re-entrant triggers

  const dir = sendSysExDir();
  const exe = path.join(dir, 'SendSysEx.exe');

  const win = openUpdateWindow(parentWindow);
  const send = (channel, payload) => {
    if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
  };

  win.webContents.once('did-finish-load', () => {
    updateProcess = spawn(exe, ['--fw-update', 'KBP4'], { cwd: dir });

    updateProcess.stdout.on('data', (chunk) => send('firmware-log:data', chunk.toString()));
    updateProcess.stderr.on('data', (chunk) => send('firmware-log:data', chunk.toString()));

    updateProcess.on('error', (err) => {
      send('firmware-log:data', `\nFailed to launch SendSysEx.exe: ${err.message}\n`);
      send('firmware-log:done', { code: -1 });
      updateProcess = null;
      if (typeof onDone === 'function') onDone(-1);
    });

    updateProcess.on('close', (code) => {
      send('firmware-log:done', { code });
      updateProcess = null;
      if (typeof onDone === 'function') onDone(code);
    });
  });
}

module.exports = { startFirmwareUpdate };
