// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import pkg from '../../package.json'
const { version } = pkg

export default {
  device: {
    "connected": false,
    "reconnected": false,
    "bootloaderMode": false,
    "firmwareVersion": "0.0.0.0",
    "bootloaderVersion": "0.0.0.0",
    "minimumCompatibleFirmwareVersion": "1.2.0.0",
    "availableFirmware": {
      "url": {
        "central": "firmware/k-board-pro-4-central-v1.2.2.0.syx",
        "peripheral": "firmware/k-board-pro-4-peripheral-v1.2.2.0.syx"
      },
      "version": "1.2.2.0"
    },
    "firmwareUpdateAvailable": false,
    "updatingFirmware": false,
    "firmwareStage": "idle",
    "firmwareBoardsUpdated": 0,
    "firmwareBoardsExpected": 4,
    "firmwareError": null
  },
  editor: {
    "editorVersion": version,
    "beta": false,
    "availableEditor": {version: '0.0.0'},
    "editorUpdateAvailable": false,
    "updatingEditor": false,
    "downloadProgress": 0,
    "minimumCompatibleVersion": "1.2.0.0",
    "networkConnection": false,

    "statusMessage": 'disconnected',

    "devicePresetsLoaded": false,
    "factoryPresetsLoaded": false,
    "userPresetsLoaded": false,
    "initialPresetLoaded": false,
    "selectedPreset": 'factory-0',
    "destination": 1,

    "userPresetDialogOpen": false,
    "userPresetName": '',

    "revertablePreset": false,
    "revertableCurve": false,

    "curveEditorOpener": "noteOnVelocity",
    "selectedVelocityCurve": 7,
    "selectedUserCurve": 0,
    "selectedZone": 0,
    "selectedKey": -1,
    "sensorEditMode": 0,

    "preferencesOpen": false,
    "velocityCurvesOpen": false,
    "keyGainModeOpen": false,
    "presetsImportRenameDialogOpen": false,

    "visualzerActive": false,
    "synthEnabled": false,
    "soloMessageType": 0,
    "soloMessageChannel": 1,

    "midithruport": "none",

    "importedPresets": {
      "presets": [],
      "duplicates": {},
      "renamed": {}
    }
  },
  currentPreset: {
    "name": "K-Board Pro 4 Preset",
    "preset_version": [1,2,0,0],
    "mpe_mode": 1,

    "zone_split_key_num": 48,
    "reserved_zone_global_0": [0,0],

    "number_of_MPE_member_channels":[7,7],
    "device_channels": [0,15],

    "octave": [1,1],
    "transpose": [0,0],

    "device_sensitivity":25,
    "slider_sensitivity": 0,
    "led_mode": 0,

    "y_axis_invert": [0,0],
    "z_axis_invert": [0,0],
    "release_velocity": [0,0],
    "note_on_velocity_table_index":[0,0],
    "release_velocity_table_index":[0,0],

    "pitch_bend": {
      "master_range": [4,4],
      "member_range": [5,5],
      "return_mode": [1,1],
      "return_time": [10,10],
      "return_curve": [0,0]
    },
    "keys": [
      {
        "mode":[0,0],
        "threshold":[0,0],
        "gain":["1.00","1.00"],
        "offset":[0,0],
        "cc":[0,0],
        "relative_start": [0,0],
        "curve": [0,0],
        "zero_on_release": [0,0]
      },
      {
        "mode":[0,0],
        "threshold":[0,0],
        "gain":["1.00","1.00"],
        "offset":[0,0],
        "cc":[0,0],
        "relative_start": [0,0],
        "curve": [0,0],
        "zero_on_release": [0,0]
      },
      {
        "mode":[0,0],
        "threshold":[0,0],
        "gain":["1.00","1.00"],
        "offset":[0,0],
        "cc":[0,0],
        "relative_start": [0,0],
        "curve": [0,0],
        "zero_on_release": [0,0]
      }
    ],
    "pedals": [
      {
        "mode": 0,
        "cc": 0,
        "threshold": 0,
        "zone":0
      },
      {
        "mode": 0,
        "cc": 0,
        "threshold": 0,
        "zone":0
      }
    ],
    "sliders": [
      {
        "mode": 0,
        "cc": 0,
        "zone": 0
      },
      {
        "mode": 0,
        "cc": 0,
        "zone": 0
      },
      {
        "mode": 0,
        "cc": 0,
        "zone": 0
      },
      {
        "mode": 0,
        "cc": 0,
        "zone": 0
      }
    ],
    "addendum": {}
  },
  presets: {
    "device": [],
    "user": [],
    "factory": []
  },
  userCurves: {
    'usercurve-0': Array.from(Array(128).keys()),
    'usercurve-1': Array.from(Array(128).keys()),
    'usercurve-2': Array.from(Array(128).keys()),
    'usercurve-3': Array.from(Array(128).keys())
  },
  keySensors: {
    'sensorsLoaded': false,
    'ganged_2':  [0,1].map(bank => [0,1,2,3].map(octave => [0,1,2,3,4,5,6,7,8,9,10,11].map(key => [[0,0,0,0,0,0],[0,0,0,0,0,0]]))),
    'ganged_12': [0,1].map(bank => [0,1,2,3].map(octave => [0,1,2,3,4,5,6,7,8,9,10,11].map(key => [[0],[0]]))),
    'overrides': {}
  },
  editorPreferences: {
    "showTooltips": true,
    "autohideZoneBackground": true
  }
}
