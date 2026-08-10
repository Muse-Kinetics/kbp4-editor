// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.

//
// notarize.js — afterSign hook for electron-builder (macOS only).
// Uses xcrun notarytool via a stored keychain profile so no plaintext
// credentials are needed. Set APPLE_KEYCHAIN_PROFILE in .env before building.
//
// This hook is not wired up in package.json "build.afterSign" by default.
// macOS notarization runs as a post-package step via "npm run notarize-dmg"
// (node release-mac.js) instead.
//

require('dotenv').config({ quiet: true });

const path = require('path');
const fs = require('fs');

module.exports = async function notarize(params) {
  if (process.platform !== 'darwin') return;

  const appId = 'com.kmimusic.KBoardPro4Editor';
  const appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );

  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  const keychainProfile = process.env.APPLE_KEYCHAIN_PROFILE;
  if (!keychainProfile) {
    throw new Error(
      'APPLE_KEYCHAIN_PROFILE is not set. Run: xcrun notarytool store-credentials'
    );
  }

  console.log(`Notarizing ${appId} at ${appPath}`);
  const { notarize } = require('@electron/notarize');
  await notarize({ tool: 'notarytool', appPath, keychainProfile });
  console.log(`Done notarizing ${appId}`);
};
