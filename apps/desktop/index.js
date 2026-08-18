// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

'use strict';

//
// index.js — Electron main process for the K-Board Pro 4 Editor.
//
// The renderer is the built web editor (apps/web), synced into ./renderer by
// sync-renderer.js and loaded via loadFile. Ported from the ERB main.dev.js.
//

const path = require('path');
const { app, ipcMain, BrowserWindow, dialog, shell } = require('electron');
const MenuBuilder = require('./menu');

// Windows-only: WebMIDI can't drive a K-Board Pro 4 firmware update safely
// there (see firmware/kbp4-firmware-update-process.md), so Windows shells out
// to a bundled sendsysex instead. macOS never requires this module at all.
const firmwareUpdate = process.platform === 'win32' ? require('./firmwareUpdate') : null;

let mainWindow = null;

const windowOptions = {
  title: 'K-Board Pro 4',
  backgroundColor: '#2d2d2d',
  height: 693,
  minHeight: 693,
  show: false,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js'),
    // Match Chrome's autoplay behavior. Electron defaults to
    // 'no-user-gesture-required', so it eagerly opens the hardware audio output
    // for nexusui's on-load ScriptProcessorNode — which can segfault the renderer
    // on macOS. Requiring a user gesture keeps the AudioContext suspended until
    // the user actually interacts, exactly as in Chrome.
    autoplayPolicy: 'document-user-activation-required',
  },
};

if (process.platform === 'darwin') {
  windowOptions.titleBarStyle = 'hidden';
  windowOptions.width = 994;
  windowOptions.minWidth = 994;
  // +15px so the content shifted down (see .editor.mac top padding) to clear the
  // overlaid traffic-light buttons doesn't lose anything off the bottom.
  windowOptions.height = 708;
  windowOptions.minHeight = 708;
} else if (process.platform === 'win32') {
  // Previously an exact-fit 1017x760 with zero margin around the actual
  // content size — DPI-scaling rounding (measured content viewport varying
  // ~1001-1031 wide / 722-732 tall across otherwise-identical launches) could
  // tip that into showing scrollbars. Sized with real margin instead of an
  // exact fit so that jitter doesn't matter.
  windowOptions.height = 780;
  windowOptions.width = 1040;
  windowOptions.minWidth = 1040;
  windowOptions.minHeight = 780;
} else if (process.platform === 'linux') {
  windowOptions.width = 1064;
}

function createWindow() {
  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on('render-process-gone', (e, details) => {
    console.error('[render-process-gone]', JSON.stringify(details));
  });
  app.on('child-process-gone', (e, details) => {
    console.error('[child-process-gone]', JSON.stringify(details));
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  const menu = menuBuilder.buildMenu();

  ipcMain.on('menu-toggle-tooltips', (e, status) => {
    const item = menu.getMenuItemById('show_tooltips');
    if (item) item.checked = status.checked;
  });
  ipcMain.on('menu-update-firmware', (e, status) => {
    const item = menu.getMenuItemById('update_firmware');
    if (item) item.enabled = status.enabled;
  });
  // open an external link (e.g. the support site) in the system browser.
  // Guarded to http(s) so the renderer can't ask the OS to open arbitrary URIs.
  ipcMain.on('open-external', (e, url) => {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) shell.openExternal(url);
  });
  // Windows-only firmware update, via bundled sendsysex — see firmwareUpdate.js.
  // No-op if this somehow fires on another platform (firmwareUpdate is null there).
  ipcMain.on('firmware-update-sendsysex', () => {
    if (!firmwareUpdate || !mainWindow) return;
    firmwareUpdate.startFirmwareUpdate(mainWindow, (code) => {
      if (mainWindow) mainWindow.webContents.send('firmware-update-sendsysex-done', { code });
    });
  });

  mainWindow.on('unresponsive', () => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'K-Board Pro 4 Editor has stopped responding',
        buttons: ['Reload', 'Close'],
      })
      .then(({ response }) => {
        if (!mainWindow) return;
        if (response === 0) mainWindow.reload();
        else mainWindow.close();
      });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', createWindow);

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
