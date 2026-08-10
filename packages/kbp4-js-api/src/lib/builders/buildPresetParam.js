// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SYX_MESSAGE_START_LOCATION,
  SYX_EDIT_SENSOR_CALIBRATION,
  SYX_PRESET_MSG_NAME_STRING,
  SYX_PRESET_MSG_KEY_AXIS,
  SYX_PRESET_MSG_KEY_AXIS_V1_2,
  SYX_PRESET_MSG_PEDAL,
  SYX_PRESET_MSG_SLIDER,
  SYX_PRESET_MSG_PITCH_BEND,
  SYX_PRESET_MSG_PITCH_BEND_V1_2,
  SYX_PRESET_ZONE_GLOBALS,
  SYX_PRESET_ZONE_GLOBALS_V1_2,
  SYX_PRESET_GLOBALS,
  SYX_PRESET_GLOBALS_V1_2,
  SYX_SEND_MEM_LOCATION
} from '../constants/sysEx'
import presetParams from '../constants/presetParams'
import { decodeValues, decodeName, decodeKeyAxis, decodeZoneGlobals, decodeGlobals } from '../utilities'

export default function buildPresetParam(sysex){
  const [messageType, ...message] = [...sysex].slice(SYX_MESSAGE_START_LOCATION, -1)

  switch (messageType) {
    case SYX_EDIT_SENSOR_CALIBRATION: {
      return {
        param: 'calibration',
        values: message
      }
    }
      break;
    case SYX_SEND_MEM_LOCATION: {
      return {
        param: 'sensor',
        values: decodeValues('set_sensor', message).toString()
      }
    }
      break;
    case SYX_PRESET_MSG_NAME_STRING: {
      return {
        param: 'name',
        values: decodeName(message)
      }
    }
    case SYX_PRESET_MSG_KEY_AXIS:
    case SYX_PRESET_MSG_KEY_AXIS_V1_2: {
      return {
        param: 'key_axis',
        values: decodeKeyAxis(message).toString() // decode gain + offset
      }
    }

    case SYX_PRESET_MSG_PEDAL: {
      return {
        param: 'pedal',
        values: message.toString()
      }
    }

    case SYX_PRESET_MSG_SLIDER: {
      return {
        param: 'slider',
        values: message.toString()
      }
    }

    case SYX_PRESET_MSG_PITCH_BEND:
    case SYX_PRESET_MSG_PITCH_BEND_V1_2: {
      return {
        param: 'pitch_bend',
        values: decodeValues('pitch_bend', message).toString() // decode return time
      }
    }

    case SYX_PRESET_ZONE_GLOBALS:
    case SYX_PRESET_ZONE_GLOBALS_V1_2: {
      return {
        param: 'zone_globals',
        values: decodeZoneGlobals(message).toString()
      }
    }

    case SYX_PRESET_GLOBALS:
    case SYX_PRESET_GLOBALS_V1_2: {
      return {
        param: 'globals',
        values: decodeGlobals(message).toString()
      }
    }

    default: {

    }
  }
}
