// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SYX_MESSAGE_START_LOCATION,
  SYX_MESSAGE_START_LOCATION_TABLE,
  SYX_EDIT_SENSOR_CALIBRATION,
  SYX_PRESET_START,
  SYX_PRESET_END,
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
  SYX_FIRMWARE_VERSION_MSG,
  SYX_PERIPHERAL_PRESENT,
  SYX_GET_USER_TABLE,
  SYX_UI_SYNC_MESSAGE,
  SYX_UI_SYNC_ACTIVE_PRESET,
  SYX_UI_SYNC_ZONE_MEMBER_BEND_RANGE,
  SYX_UI_SYNC_ZONE_OCTAVE,
  SYX_UI_SYNC_ZONE_TRANSPOSE,
  SYX_UI_SYNC_ZONE_RETURN_MODE,
  SYX_UI_SYNC_ZONE_RETURN_TIME,
  SYX_UI_SYNC_SLIDER_MODE_CHANGE,
  SYX_SEND_MEM_LOCATION
} from '../constants/sysEx'
import {
  CALIBRATION,
  FIRMWAREVERSION,
  FIRMWAREUPDATECOMPLETE,
  PERIPHERALREADY,
  PRESETBEGIN,
  PRESETPARAM,
  PRESETEND,
  USERCURVE,
  SENSORKEYDATA,
  SENSORDATA,
  MIDI,
  UI
} from '../constants/eventNames'
import buildPresetParam from '../builders/buildPresetParam'
import buildFirmwareVersion from '../builders/buildFirmwareVersion'
import { paramObjectFactory } from '../utilities'

export default function midiMessageHandler(event, device){
  const data = event.data
  let messageType, message, curveIndex
  // a user curve response does not use a length byte. so we will have to parse the message in another way
  if(data.length === 137) {
    messageType = SYX_GET_USER_TABLE; // this is the same message type as getting a table
    [curveIndex, ...message] = [...data].slice(SYX_MESSAGE_START_LOCATION_TABLE, -1)
  } else {
    [messageType, ...message] = [...data].slice(SYX_MESSAGE_START_LOCATION, -1)
  }

  let eventName = 'error',
      parsedMessage

  if(device._debug === 'sysex') console.log('>> raw midi data', data);
  switch(messageType){
    case SYX_EDIT_SENSOR_CALIBRATION:
      // calibration data
      eventName = CALIBRATION
      parsedMessage = data

      // emit event and payload
      device.emit(eventName, parsedMessage)
      break;
    case SYX_PRESET_MSG_KEY_AXIS:
    case SYX_PRESET_MSG_KEY_AXIS_V1_2:
      // key axis
    case SYX_PRESET_MSG_PEDAL:
      // pedal
    case SYX_PRESET_MSG_SLIDER:
      // slider
    case SYX_PRESET_MSG_NAME_STRING:
      // name
    case SYX_PRESET_MSG_PITCH_BEND:
    case SYX_PRESET_MSG_PITCH_BEND_V1_2:
      // pitch bend
    case SYX_PRESET_ZONE_GLOBALS:
    case SYX_PRESET_ZONE_GLOBALS_V1_2:
      // zone globals
    case SYX_PRESET_GLOBALS:
    case SYX_PRESET_GLOBALS_V1_2:
      // globals
      eventName = PRESETPARAM
      parsedMessage = buildPresetParam(data)
      // emit event and payload
      if(device._debug === 'param') console.log('>> param', parsedMessage)
      // don't build presets from device dumps during a firmware update
      if(!device.updatingFirmware) device.emit(eventName, parsedMessage)
      break;
    case SYX_PRESET_START:
      eventName = PRESETBEGIN
      parsedMessage = message
      // emit event and payload (skipped during a firmware update)
      if(!device.updatingFirmware) device.emit(eventName, paramObjectFactory('presetbegin', parsedMessage.toString()))
      break
    case SYX_PRESET_END:
      eventName = PRESETEND
      parsedMessage = message
      // emit event and payload (skipped during a firmware update)
      if(!device.updatingFirmware) device.emit(eventName, paramObjectFactory('presetend', parsedMessage.toString()))
      break;
    case SYX_FIRMWARE_VERSION_MSG:
      eventName = FIRMWAREVERSION
      parsedMessage = buildFirmwareVersion(message)
      device.emit(eventName, parsedMessage)
      break;
    case SYX_PERIPHERAL_PRESENT:
      if(device.updatingFirmware) {
        const boardNumber = Number(data.slice(9, -1))
        eventName = PERIPHERALREADY
        device.updatedBoards += 1
        device.emit(eventName, boardNumber)
      }

      if(device.updatedBoards === 4) {
        eventName = FIRMWAREUPDATECOMPLETE
        device.updatingFirmware = false
        device.updatedBoards = 0
        device.emit(eventName)
      }

      break;
    case SYX_GET_USER_TABLE: // this is the same message type as getting a table
      eventName = USERCURVE
      device.emit(eventName, {
        index: curveIndex,
        curve: message
      })
      break;
    case SYX_SEND_MEM_LOCATION:
      eventName = SENSORDATA
      parsedMessage = buildPresetParam(data)
      const [mode,gang] = parsedMessage.values.split(',')

      eventName = gang === '1' ? SENSORKEYDATA : SENSORDATA

      // remove mode byte
      device.emit(eventName, {
        param: parsedMessage.param,
        values: parsedMessage.values.split(',').slice(1).join(','),
        override: mode === '3' ? true : false
      })
      break;
    case SYX_UI_SYNC_MESSAGE:
      const [zone, ui, value] = message
      eventName = UI

      switch(ui) {
        case SYX_UI_SYNC_ACTIVE_PRESET:
          device.emit(eventName, {
            ui: 'active_preset',
            value: value,
            zone: null
          })
          break;
        case SYX_UI_SYNC_ZONE_MEMBER_BEND_RANGE:
          device.emit(eventName, {
            ui: 'pitch_bend_range',
            value: value,
            zone: zone
          })
          break;
        case SYX_UI_SYNC_ZONE_OCTAVE:
          device.emit(eventName, {
            ui: 'octave',
            value: value,
            zone: zone
          })
          break;
        case SYX_UI_SYNC_ZONE_TRANSPOSE:
          device.emit(eventName, {
            ui: 'transpose',
            value: value,
            zone: zone
          })
          break;
        case SYX_UI_SYNC_ZONE_RETURN_MODE:
          device.emit(eventName, {
            ui: 'return_mode',
            value: value,
            zone: zone
          })
          break;
        case SYX_UI_SYNC_ZONE_RETURN_TIME:
          device.emit(eventName, {
            ui: 'return_time',
            value: value,
            zone: zone
          })
          break;
        case SYX_UI_SYNC_SLIDER_MODE_CHANGE:
          device.emit(eventName, {
            ui: 'slider_mode',
            value: value,
            zone: zone
          })
          break;
        default:
          console.log('>> K-Board Pro 4: UI Sync type not recognized')
      }
      break;
    default:
      device.emit(MIDI, data)
  }
}
