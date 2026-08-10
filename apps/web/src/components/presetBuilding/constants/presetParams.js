// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export default {
  'keys': {
    zoned: true,
    indexed: true,
    prependParams: ['zone', 'axis'],
    params: ['mode', 'threshold', 'gain', 'offset', 'cc', 'relative_start', 'curve', 'zero_on_release']
  },
  'pedals': {
    zoned: false,
    indexed: true,
    prependParams: ['index'],
    params: ['mode', 'cc', 'threshold', 'zone']
  },
  'sliders': {
    zoned: false,
    indexed: true,
    prependParams: ['index'],
    params: ['mode', 'cc', 'zone']
  },
  'name': {
    zoned: false,
    indexed: false,
    prependParams: [],
    params: ['name']
  },
  'pitch_bend': {
    zoned: true,
    indexed: false,
    prependParams: ['zone'],
    params: ['master_range', 'member_range', 'return_mode', 'return_time', 'return_curve']
  },
  'zone_globals': {
    zoned: true,
    indexed: false,
    prependParams: ['zone'],
    params: [
        'reserved_zone_global_0',
        'number_of_MPE_member_channels',
        'device_channels',
        'octave',
        'transpose',
        'y_axis_invert',
        'z_axis_invert',
        'release_velocity',
        'note_on_velocity_table_index',
        'release_velocity_table_index'
      ]
  },
  'globals': {
    zoned: false,
    indexed: false,
    prependParams: [],
    params: [
      'preset_version',
			'preset_version',
			'preset_version',
			'preset_version',
			'mpe_mode',
			'zone_split_key_num',
      'device_sensitivity',
      'slider_sensitivity',
      'led_mode'
		]
  }
}
