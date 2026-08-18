// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

'use strict';

// Preload for the firmware-update log window (firmwareUpdateWindow.html).
// Exposes only the two one-way, main-to-renderer channels that window needs.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('firmwareUpdate', {
  onData: (listener) => ipcRenderer.on('firmware-log:data', (event, chunk) => listener(chunk)),
  onDone: (listener) => ipcRenderer.on('firmware-log:done', (event, payload) => listener(payload)),
});
