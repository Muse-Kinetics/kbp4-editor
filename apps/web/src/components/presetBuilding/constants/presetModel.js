// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export default {
  "name": "K-Board Pro 4 Preset",
  "preset_version": [1,2,1,0],
  "mpe_mode": 1,

  "zone_split_key_num": 0,
  "reserved_zone_global_0": [0,0],

  "number_of_MPE_member_channels":[0,0],
  "device_channels": [0,15],

  "octave": [0,0],
  "transpose": [0,0],

  "device_sensitivity":30,
  "slider_sensitivity": 0,
  "led_mode": 0,

  "y_axis_invert": [0,0],
  "z_axis_invert": [0,0],
  "release_velocity": [0,0],
  "note_on_velocity_table_index":[0,0],
  "release_velocity_table_index":[0,0],

  "pitch_bend": {
    "master_range": [0,0],
    "member_range": [0,0],
    "return_mode": [1,1],
    "return_time": [100,100],
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
}
