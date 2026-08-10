// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

//
// menu.js — application menu. Bridges native menu actions to the renderer over
// IPC (preferences, preset-import/export, firmware-update, toggle-tooltips) and
// drives the manual update check. Ported from the ERB MenuBuilder to plain
// CommonJS + modern Electron roles.
//

const fs = require('fs');
const { Menu, shell, dialog } = require('electron');

const checkForUpdates = require('./updater');

const MANUAL_URL =
  'https://files.keithmcmillen.com/products/k-board-pro-4/documentation/k-board-pro-4-manual.pdf';
const QUICKSTART_URL =
  'https://files.keithmcmillen.com/products/k-board-pro-4/documentation/k-board-pro-4-quickstart.pdf';
const SUPPORT_URL = 'https://support.keithmcmillen.com/';

class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'win32' ? this.buildWinTemplate() : this.buildMacTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return menu;
  }

  setupDevelopmentEnvironment() {
    // DevTools no longer auto-opens on launch — it's available via
    // Help > Toggle Developer Tools (or right-click > Inspect element).
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        { label: 'Inspect element', click: () => this.mainWindow.inspectElement(x, y) },
      ]).popup({ window: this.mainWindow });
    });
  }

  send(channel, ...args) {
    this.mainWindow.webContents.send(channel, ...args);
  }

  importPresets() {
    dialog
      .showOpenDialog(this.mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
      })
      .then(({ canceled, filePaths }) => {
        if (canceled || !filePaths || !filePaths.length) return;
        const importedPresets = fs.readFileSync(filePaths[0]);
        this.send('preset-import', JSON.parse(importedPresets));
      });
  }

  editSubmenu() {
    // Required for the standard clipboard shortcuts (Cmd/Ctrl+C/V/X, Select All)
    // to work at all — in text fields and in DevTools. Without an Edit menu
    // carrying these roles, macOS never routes the shortcuts to the focused view.
    return {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    };
  }

  viewSubmenu() {
    return {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    };
  }

  presetsSubmenu() {
    return {
      label: 'Presets',
      submenu: [
        { label: 'Import Presets', accelerator: 'CmdOrCtrl+I', click: () => this.importPresets() },
        { label: 'Export Presets', accelerator: 'CmdOrCtrl+E', click: () => this.send('preset-export') },
      ],
    };
  }

  hardwareSubmenu() {
    return {
      label: 'Hardware',
      submenu: [
        {
          label: 'Update Firmware',
          id: 'update_firmware',
          enabled: false,
          accelerator: 'CmdOrCtrl+Shift+Alt+F',
          click: () => this.send('firmware-update'),
        },
      ],
    };
  }

  windowSubmenu() {
    return { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }] };
  }

  helpSubmenu() {
    return {
      label: 'Help',
      submenu: [
        { label: 'K-Board Pro 4 Manual', click: () => shell.openExternal(MANUAL_URL) },
        { label: 'K-Board Pro 4 QuickStart Guide', click: () => shell.openExternal(QUICKSTART_URL) },
        { type: 'separator' },
        { label: 'K-Board Pro 4 Support', click: () => shell.openExternal(SUPPORT_URL) },
        {
          label: 'Show Tooltips',
          id: 'show_tooltips',
          accelerator: 'CmdOrCtrl+T',
          type: 'checkbox',
          checked: false,
          click: (item) => this.send('toggle-tooltips', item.checked),
        },
        { type: 'separator' },
        { role: 'toggleDevTools' },
      ],
    };
  }

  buildMacTemplate() {
    const about = {
      label: 'K-Board Pro 4 Editor',
      submenu: [
        { role: 'about', label: 'About K-Board Pro 4 Editor' },
        { type: 'separator' },
        { label: 'Preferences', accelerator: 'CmdOrCtrl+,', click: () => this.send('preferences') },
        { label: 'Check For Updates', click: (item) => checkForUpdates(item) },
        { type: 'separator' },
        { role: 'hide', label: 'Hide K-Board Pro 4 Editor' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit' },
      ],
    };

    return [
      about,
      this.editSubmenu(),
      this.viewSubmenu(),
      this.presetsSubmenu(),
      this.hardwareSubmenu(),
      this.windowSubmenu(),
      this.helpSubmenu(),
    ];
  }

  buildWinTemplate() {
    const file = {
      label: 'File',
      submenu: [
        { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: () => this.send('preferences') },
        { label: 'Check For Updates', click: (item) => checkForUpdates(item) },
        { label: 'Exit', accelerator: 'Ctrl+W', click: () => this.mainWindow.close() },
      ],
    };

    return [
      file,
      this.editSubmenu(),
      this.viewSubmenu(),
      this.presetsSubmenu(),
      this.hardwareSubmenu(),
      this.windowSubmenu(),
      this.helpSubmenu(),
    ];
  }
}

module.exports = MenuBuilder;
