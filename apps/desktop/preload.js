// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

//
// preload.js — runs with Node access in an isolated context and exposes only a
// minimal, safe `ipcRenderer` to the renderer's main world via contextBridge.
//
// The renderer itself runs with nodeIntegration:false / contextIsolation:true —
// i.e. as a plain browser page, exactly as it does in Chrome.
//

const { contextBridge, ipcRenderer } = require('electron');

// The editor's handlers are (event, ...args) but only ever use the args; the
// real IpcRendererEvent isn't cloneable across the bridge, so pass a stand-in.
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, listener) => {
    ipcRenderer.on(channel, (event, ...args) => listener({}, ...args));
  },
  once: (channel, listener) => {
    ipcRenderer.once(channel, (event, ...args) => listener({}, ...args));
  },
  // The editor passes a fresh closure to off() (never a match even historically),
  // so removing all listeners for the channel is the honest, working behavior.
  off: (channel) => ipcRenderer.removeAllListeners(channel),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
});
