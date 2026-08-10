// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SYX_MESSAGE_START,
  SYX_MESSAGE_START_TABLE,
  SYSEX_END,
  SYX_LENGTH_LOCATION,
  LENGTH_OF_SYX_PRESET_MSG_BOILERPLATE,
  MAX_NAME_STRING_LENGTH
} from '../constants/sysEx'
import presetParams from '../constants/presetParams'

import {
  clamp,
  notEmpty,
  notUndefined,
  notNegative,
  encodeName,
  encodeGain,
  encodeValues,
  decodeValues
} from '../utilities'

const noValueParams = ['request_id', 'recalc_sensor_data']

export default function buildSysexMessage(paramName, paramValues) {
  let message = [
        ...( paramName === 'save_curve' ? SYX_MESSAGE_START_TABLE : SYX_MESSAGE_START.concat('length', presetParams[paramName].sysexID) ) // length placeholder
      ],
      formattedValues = null

  if(paramValues !== undefined && !validParamLength(paramName, paramValues)) return

  switch (paramName) {
    case 'save_preset':
      // fallthrough to  request_preset
    case 'load_preset':
      // fallthrough to  request_preset
    case 'request_preset':
      formattedValues = [Number(paramValues)]
      break;
    case 'name':
      formattedValues = encodeName(paramValues.toString(), MAX_NAME_STRING_LENGTH)
      break;
    case 'slider':
      // fallthrough to zone_globals
    case 'pedal':
      // fallthrough to zone_globals
    case 'globals':
      // fallthrough to zone_globals
    case 'key_axis':
      // fallthrough to zone_globals
    case 'pitch_bend':
      // fallthrough to zone_globals
    case 'zone_globals':
      // fallthrough to zone_globals
      formattedValues = encodeValues(paramName, paramValues)
      break;
    case 'get_curve':
      formattedValues = [Number(paramValues)]
      break;
    case 'save_curve':
      // curve index and curve
      formattedValues = encodeValues(paramName, paramValues)
      break;
    case 'erase_sensor_bank':
      formattedValues = [Number(paramValues)]
      break;
    case 'get_sensor_bank':
      formattedValues = [Number(paramValues)]
      break;
    case 'set_sensor':
      // set sensor
      formattedValues = encodeValues(paramName, paramValues)
      break;
    case 'send_solo':
      // solo message
      formattedValues = encodeValues(paramName, paramValues)
      break;
    default:
      // handle [request_id, recalc_sensor_data] & errors
      console.log(`>> K-Board Pro 4: ${paramName === 'request_id' ? 'request device ID' : paramName}`)
  }
  // add param values
  if(!noValueParams.includes(paramName)) message.push(...formattedValues)

  message.push(SYSEX_END)

  let finalMessage

  if(paramName === 'save_curve') {
    finalMessage = message
  } else {
    // add length byte
    finalMessage = setLengthByte(message)
  }

  return finalMessage
}

function setLengthByte(message){
  const sysexMessage = [...message],
        messageLength = sysexMessage.length - LENGTH_OF_SYX_PRESET_MSG_BOILERPLATE

  sysexMessage[SYX_LENGTH_LOCATION] = messageLength

  return sysexMessage
}

function validParamLength(paramName, paramValues){
  const allParams = [
    ...presetParams[paramName].prependParams,
    ...presetParams[paramName].params
  ]
  const messageParamLength = paramValues.length,
        expectedParamLength = allParams.length

  if(messageParamLength > expectedParamLength) {
    console.error(`>> K-Board Pro 4: ${messageParamLength - expectedParamLength} extra ${paramName} param values`);
    return false
  } else if(messageParamLength < expectedParamLength) {
    console.error(`>> K-Board Pro 4: missing ${expectedParamLength - messageParamLength} ${paramName} param values`);
    return false
  } else if(!paramValues.every(notUndefined)) {
    console.error(`>> K-Board Pro 4: undefined param values in ${paramName}`);
    return false
  } else if(!paramValues.every(notEmpty)) {
    console.error(`>> K-Board Pro 4: empty param values in ${paramName}`);
    return false
  } else if(paramName !== 'key_axis' && !paramValues.every(notNegative)) {
    console.error(`>> K-Board Pro 4: negative param values in ${paramName}`);
    return false
  }

  return true
}
