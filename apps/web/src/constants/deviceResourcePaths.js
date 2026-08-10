// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
const basePath = 'https://files.keithmcmillen.com/products/k-board-pro-4/'

export default {
  base: basePath,
  factoryPresets: basePath + "editor/factoryPresets.json",
  factoryPresetsBeta: basePath + "editor/factoryPresetsBeta.json",
  factoryPresetsCurrentVersion: basePath + "editor/factoryPresetsVersion.json",
  factoryPresetsCurrentVersionBeta: basePath + "editor/factoryPresetsVersionBeta.json",
  // editor version, firmare version, firmware path
  firmwareCurrentVersion: basePath + "firmware/currentVersion.json",
  firmwareCurrentVersionBeta: basePath + "firmware/currentVersionBeta.json",
  editorCurrentVersion: basePath + "editor/currentVersion.json",
  editorCurrentVersionBeta: basePath + "editor/currentVersionBeta.json"
}
