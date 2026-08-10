#!/usr/bin/env node
// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

//
// sync-renderer.js — Build the web editor and sync its output into ./renderer/.
// The desktop loads the renderer over file://, so the web build is produced
// with PUBLIC_URL='./' to emit relative asset paths (the web deploy uses the
// absolute homepage URL instead).
//

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const webDir = path.resolve(__dirname, '..', 'web');
const webBuild = path.join(webDir, 'build');
const rendererDir = path.resolve(__dirname, 'renderer');

console.log('>> building web editor (PUBLIC_URL=./ for file://)…');
execFileSync('npm', ['run', 'build'], {
  cwd: webDir,
  stdio: 'inherit',
  env: { ...process.env, PUBLIC_URL: './', CI: 'false' },
  shell: process.platform === 'win32',
});

if (!fs.existsSync(webBuild)) {
  throw new Error(`web build output not found at ${webBuild}`);
}

console.log('>> syncing web build → desktop renderer/');
fs.rmSync(rendererDir, { recursive: true, force: true });
fs.cpSync(webBuild, rendererDir, { recursive: true });
console.log('renderer synced.');

// Inject a Content-Security-Policy into the DESKTOP renderer only (loaded from
// file://). This silences Electron's insecure-CSP warning and tightens the
// packaged app without affecting the web deploy (whose index.html is untouched).
// 'self' covers local file:// assets and webpack's async chunks; 'unsafe-inline'
// covers the inline runtime + process shim; connect-src allows the remote
// firmware/preset fetches.
const rendererIndex = path.join(rendererDir, 'index.html');
let html = fs.readFileSync(rendererIndex, 'utf8');

// Strip Google Analytics (gtag) from the desktop renderer — a packaged desktop
// app shouldn't phone home to GA, it can't load over file://, and the CSP below
// blocks it anyway (which logged a console error). Web deploy keeps its own.
const beforeGtag = html;
html = html
  .replace(/<script[^>]*googletagmanager\.com[^>]*><\/script>\s*/gi, '')
  .replace(/<script>\s*window\.dataLayer[\s\S]*?gtag\('config'[\s\S]*?<\/script>\s*/gi, '');
if (html !== beforeGtag) {
  console.log('>> stripped Google Analytics (gtag) from desktop renderer');
}

if (!/Content-Security-Policy/i.test(html)) {
  const csp =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self' data:; " +
    "media-src 'self'; " +
    "connect-src 'self' https://files.keithmcmillen.com";
  html = html.replace(
    /<head>/i,
    `<head><meta http-equiv="Content-Security-Policy" content="${csp}">`
  );
  fs.writeFileSync(rendererIndex, html);
  console.log('>> injected Content-Security-Policy into desktop renderer');
}
