// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

//
// updater.js — manual "Check For Updates" flow via electron-updater against the
// generic feed. autoDownload is off; the user confirms each step.
//
// electron-updater is lazy-loaded to avoid initializing app.getVersion() before
// the Electron app is ready (the autoUpdater getter instantiates on require).
//

const { app, BrowserWindow, dialog } = require('electron');

let autoUpdater;
let updater;

function getAutoUpdater() {
  if (autoUpdater) return autoUpdater;

  autoUpdater = require('electron-updater').autoUpdater;
  autoUpdater.autoDownload = false;

  // When run unpackaged (npm start), electron-updater otherwise skips the check
  // entirely. Force it to read dev-app-update.yml so "Check For Updates" can be
  // exercised against the live feed without building a DMG. No-op once packaged.
  autoUpdater.forceDevUpdateConfig = !app.isPackaged;

  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
  });

  autoUpdater.on('update-available', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Found Updates',
        message: 'Found updates, do you want to update now?',
        buttons: ['Install', 'Later'],
        defaultId: 0,
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate();
          if (mainWindow != null) mainWindow.webContents.send('installing-update');
        } else {
          if (updater) updater.enabled = true;
          updater = null;
        }
      });
  });

  autoUpdater.on('update-not-available', (info) => {
    dialog.showMessageBox({
      title: 'No Updates',
      message: `Version ${info.version} is the latest K-Board Pro 4 Editor`,
    });
    if (updater) updater.enabled = true;
    updater = null;
  });

  autoUpdater.on('download-progress', (progress) => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow != null) {
      mainWindow.setProgressBar(progress.percent / 100);
      mainWindow.webContents.send('download-progress', progress.percent / 100);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        title: 'Install Updates',
        message: 'Update downloaded, application will quit to update...',
      })
      .then(() => setImmediate(() => autoUpdater.quitAndInstall()));
  });

  return autoUpdater;
}

module.exports = function checkForUpdates(menuItem) {
  updater = menuItem;
  if (updater) updater.enabled = false;
  getAutoUpdater().checkForUpdates();
};
