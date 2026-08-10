// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  MAX_NAME_STRING_LENGTH,
  SYX_PRESET_MSG_KEY_AXIS,
  SYX_PRESET_MSG_KEY_AXIS_V1_2,
  SYX_PRESET_MSG_PEDAL,
  SYX_PRESET_MSG_SLIDER,
  SYX_PRESET_MSG_NAME_STRING,
  SYX_PRESET_MSG_PITCH_BEND,
  SYX_PRESET_MSG_PITCH_BEND_V1_2,
  SYX_PRESET_ZONE_GLOBALS,
  SYX_PRESET_ZONE_GLOBALS_V1_2,
  SYX_PRESET_GLOBALS,
  SYX_PRESET_GLOBALS_V1_2,
  SYX_PRESET_REQUEST,
  SYX_PRESET_REQUEST_V1_2,
  SYX_LOAD_PRESET_FROM_ROM,
  SYX_SAVE_PRESET_TO_ROM,
  SYX_FIRMWARE_VERSION_MSG,
  SYX_GET_USER_TABLE,
  SYX_REQ_MEM_LOCATION,
  SYX_ERASE_MEM_BANK,
  SYX_WRITE_MEM_LOCATION,
  SYX_SEND_MEM_LOCATION,
  SYX_SEND_SOLO_MESSAGE,
  SYX_RECALC_CALIBRATION_VALS
} from './sysEx'

export default {
  'request_id': {
    sysexID: SYX_FIRMWARE_VERSION_MSG,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: []
  },
  'erase_sensor_bank': {
    sysexID: SYX_ERASE_MEM_BANK,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: ['bankIndex']
  },
  'get_sensor_bank': {
    sysexID: SYX_REQ_MEM_LOCATION,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: ['bankIndex']
  },
  'set_sensor': {
    sysexID: SYX_WRITE_MEM_LOCATION,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: [
      'mode',
      'gang_mem_loc',
      'octave',
      'key',
      'side',
      'sensor',
      'sensor_gain' // 2-byte
    ]
  },
  'recalc_sensor_data': {
    sysexID: SYX_RECALC_CALIBRATION_VALS,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: []
  },
  'send_solo': {
    sysexID: SYX_SEND_SOLO_MESSAGE,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: ['status_byte', 'data_0', 'data_1']
  },
  'get_curve': {
    sysexID: SYX_GET_USER_TABLE,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: ['curveIndex']
  },
  'save_curve': {
    sysexID: null,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: [...Array.from({length: 128 + 1})]
  },
  'load_preset': {
    sysexID: SYX_LOAD_PRESET_FROM_ROM,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: ['presetIndex']
  },
  'save_preset': {
    sysexID: SYX_SAVE_PRESET_TO_ROM,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: ['presetIndex']
  },
  'key_axis': {
    sysexID: SYX_PRESET_MSG_KEY_AXIS_V1_2,
    zoned: true,
    grouped: true,
    prependParams: ['zone', 'axis'],
    params: [
      'mode',
      'threshold',
      'gain',  // 2-byte
      'offset', // 2-byte
      'cc',
      'relative_start',
      'curve',
      'zero_on_release'
    ]
  },
  'pedal': {
    sysexID: SYX_PRESET_MSG_PEDAL,
    zoned: false,
    grouped: true,
    prependParams: ['index'],
    params: ['mode', 'cc', 'threshold', 'zone']
  },
  'slider': {
    sysexID: SYX_PRESET_MSG_SLIDER,
    zoned: false,
    grouped: true,
    prependParams: ['index'],
    params: ['mode', 'cc', 'zone']
  },
  'name': {
    sysexID: SYX_PRESET_MSG_NAME_STRING,
    zoned: false,
    grouped: false,
    prependParams: [],
    maxNameLength: MAX_NAME_STRING_LENGTH,
    params: ['name']
  },
  'pitch_bend': {
    sysexID: SYX_PRESET_MSG_PITCH_BEND_V1_2,
    zoned: true,
    grouped: false,
    prependParams: ['zone'],
    params: ['master_range', 'member_range', 'return_mode', 'return_time', 'return_curve']
  },
  'zone_globals': {
    sysexID: SYX_PRESET_ZONE_GLOBALS_V1_2,
    zoned: true,
    grouped: false,
    prependParams: ['zone'],
    params: [
        'reserved_zone_global_0',
        'number_of_MPE_member_channels',
        'device_channels',
        'octave',
        'transpose',
        'y_axis_invert', // was reserved_zone_global_1
        'z_axis_invert',  // was reserved_zone_global_2
        'release_velocity', // 2-byte
        'note_on_velocity_table_index',
        'release_velocity_table_index'
      ]
  },
  'globals': {
    sysexID: SYX_PRESET_GLOBALS_V1_2,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: [
			'preset_version', // 0
			'preset_version', // 1
			'preset_version', // 2
			'preset_version', // 3
			'mpe_mode', // 4
			'zone_split_key_num', // 5
      'device_sensitivity', // (6) 6-7: 2-byte
      'slider_sensitivity', // (7) 8-9: 2-byte
      'led_mode'// (8) 10
		]
  },
  'request_preset': {
    sysexID: SYX_PRESET_REQUEST_V1_2,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: [ 'preset_num' ]
  },
  'request_preset_v1': {
    sysexID: SYX_PRESET_REQUEST,
    zoned: false,
    grouped: false,
    prependParams: [],
    params: [ 'preset_num' ]
  }
}
