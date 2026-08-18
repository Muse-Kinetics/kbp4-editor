// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

//
// updater.js — manual "Check For Updates" flow via electron-updater against the
// generic feed. autoDownload is off; the user confirms each step.
//
// electron-updater is lazy-loaded to avoid initializing app.getVersion() before
// the Electron app is ready (the autoUpdater getter instantiates on require).
//

const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, dialog } = require('electron');

let autoUpdater;
let updater;

// Dev-only (see writeDevUpdateConfig below): electron-updater always reads a
// fixed "dev-app-update.yml" path (app.getAppPath()/dev-app-update.yml) when
// forceDevUpdateConfig is set — it can't be told to look elsewhere per
// platform. mac and Windows packaged builds intentionally check different
// feeds (see writeDevUpdateConfig's comments), so this file has to be
// (re)written for whichever platform is actually running right before
// forceDevUpdateConfig is enabled, instead of being a static checked-in file
// — a static file can only ever be correct for one platform at a time.
function writeDevUpdateConfig() {
  const yaml = require('js-yaml');
  const packageJson = require('./package.json');
  const publishEntries = [].concat(packageJson.build?.publish || []);

  let config;
  if (process.platform === 'darwin') {
    // Matches release-mac.js's writeAppUpdateYml(): the generic feed, not
    // GitHub — electron-updater needs public, unauthenticated access to it.
    const generic = publishEntries.find((entry) => entry && entry.provider === 'generic');
    config = {
      provider: 'generic',
      url: generic.url.replace(/\$\{os\}/g, 'mac'),
      updaterCacheDirName: 'k-board-pro-4-editor-desktop-updater',
    };
  } else {
    // Matches what electron-builder itself auto-writes into a packaged
    // Windows build's resources/app-update.yml (the publish array's first
    // entry, github) — Windows isn't overridden away from that default the
    // way mac deliberately is, so mirror it rather than invent a different
    // dev-only feed.
    const github = publishEntries.find((entry) => entry && entry.provider === 'github');
    config = {
      provider: 'github',
      owner: github.owner,
      repo: github.repo,
      updaterCacheDirName: 'kbp4-editor-desktop-updater',
      publisherName: ['KMI Music, Inc.'],
    };
  }

  fs.writeFileSync(path.join(__dirname, 'dev-app-update.yml'), yaml.dump(config, { lineWidth: 120 }));
}

function getAutoUpdater() {
  if (autoUpdater) return autoUpdater;

  // When run unpackaged (npm start), electron-updater otherwise skips the check
  // entirely. Force it to read dev-app-update.yml so "Check For Updates" can be
  // exercised against the live feed without building an installer. No-op once
  // packaged.
  if (!app.isPackaged) writeDevUpdateConfig();

  autoUpdater = require('electron-updater').autoUpdater;
  autoUpdater.autoDownload = false;
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
