// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import presetParams from '../constants/presetParams'
import { clamp } from '../utilities'

export function encodeName(name, maxLength = 32) {
  const safeName = name.substring(0, maxLength)

  return [...safeName].map((_,i,a) => a.join('').charCodeAt(i)).concat(0)
}

export function decodeName(syx) {
  return syx.filter(c => c !== 0).map((c,i) => {
    return String.fromCharCode(c)
  }).join('')
}

export function encodeValues(paramName, values){
  return values.reduce((formatted, v, i) => {
		const allParams = [
			...presetParams[paramName].prependParams,
			...presetParams[paramName].params
		],
		key = allParams[i]

    switch (key) {
      case 'gain':
        formatted.push(...encodeGain(v))
        break;
      case 'offset':
        formatted.push(...encode8bitSignedValue(v))
        break;
      case 'return_time':
        formatted.push(encodeTime(v)) // 1..100
        break;
      case 'release_velocity':
        formatted.push(...encode8bitValue(v))
        break;
      case 'device_sensitivity':
        formatted.push(...encode8bitValue(v))
        break;
      case 'slider_sensitivity':
        formatted.push(...encode8bitValue(v))
        break;
      case 'status_byte': // solo mode
        formatted.push(...decodeStatusByte(v))
        break;
      case 'gang_mem_loc':
        formatted.push(encodeGangMemLoc(v))
        break;
      case 'sensor_gain':
        formatted.push(...encode8bitValue(v))
        break;
      default:
        if(v !== undefined) formatted.push(Number(v))
    }

    return formatted
  }, [])
}

export function decodeValues(paramName, values) {
	let postSensorGain = false;

  const formattedValues = values.reduce((formatted, v, i) => {
    const allParams = [
      ...presetParams[paramName].prependParams,
      ...presetParams[paramName].params
    ]

    // set key
    const key = allParams[i]

    switch (key) {
      case 'return_time':
        formatted.push(decodeTime(v)) // 0.1..10.0
        break;
      case 'gang_mem_loc':
        const GML = decodeGangMemLoc(v)
        formatted.push(...GML);
        break;
      case 'sensor_gain':
        formatted.push(decode8bitValue(values[i], values[i+1]))
        postSensorGain = i + 2;
        break;
      default:
        if(v !== undefined) formatted.push(Number(v))
    }

    return formatted
  }, [])

  // remove unneeded gain LSB byte
  if(postSensorGain) formattedValues.splice(postSensorGain,1)

	return formattedValues;
}

export function encodeTime(time, min = 0.1, max = 10.0) {
	return clamp(parseFloat((time)).toFixed(1), min, max) * 10 // 1..100
}

export function decodeTime(time, min = 1, max = 100) {
	return parseFloat(clamp(time, min, max) / 10)
}

// returns 7-bit MSB/LSB
export function encodeGain(float){
  let gain_int = (float * 100) & 0xFF,
      gain_msb = gain_int >> 7,
      gain_lsb = gain_int & 0x7F

  return [gain_msb, gain_lsb]
}

export function decodeGain(gain_msb, gain_lsb){
  let gain = (gain_msb << 7) + gain_lsb,
      value = (gain / 100).toFixed(2)

  return value
}

// returns 7-bit MSB/LSB
export function encode8bitValue(num){
  const value = num

  let value_msb = value >> 7,
      value_lsb = value & 0x7F

  return [value_msb, value_lsb]
}

export function decode8bitValue(value_msb, value_lsb){
  return (value_msb << 7) + value_lsb
}
// -127..127
export function encode8bitSignedValue(num){
  const value = (num < 0) ? 256 - Math.abs(num) : num

  let value_msb = value >> 7,
      value_lsb = value & 0x7F

  return [value_msb, value_lsb]
}

export function decode8bitSignedValue(value_msb, value_lsb){
  const value = (value_msb << 7) + value_lsb
  return (value > 127) ? value - 256 : value
}

export function encodeGangMemLoc(GML) {
  // GangType|MemoryBankLocation
  const splitGML = GML.split('|')
  return (~~splitGML[0] << 4) + ~~splitGML[1]
}

export function decodeGangMemLoc(GML){
  const gang_type = GML >> 4,
        mem_loc = GML & 0x0F

  return [gang_type, mem_loc]
}

export function decodeStatusByte(statusByte) {
  return [
    statusByte >> 4, // command
    statusByte & 0x0f // channel
  ]
}

export function decodeKeyAxis(message){
  const formattedValues = []
  formattedValues[0] = message[0] // zone
  formattedValues[1] = message[1] // axis
  formattedValues[2] = message[2] // mode
  formattedValues[3] = message[3] // threshold
  formattedValues[4] = decodeGain(message[4], message[5]) // gain
  formattedValues[5] = decode8bitSignedValue(message[6], message[7]) // offset
  formattedValues[6] = message[8] // cc
  formattedValues[7] = message[9] // relative_start
  formattedValues[8] = message[10] // curve
  formattedValues[9] = message[11] // zero on release

  return formattedValues
}

export function decodeZoneGlobals(message) {
  const formattedValues = []
  formattedValues[0] = message[0]
  formattedValues[1] = message[1]
  formattedValues[2] = message[2]
  formattedValues[3] = message[3]
  formattedValues[4] = message[4]
  formattedValues[5] = message[5]
  formattedValues[6] = message[6]
  formattedValues[7] = message[7]

  formattedValues[8] = decode8bitValue(message[8], message[9])
  formattedValues[9] = message[10]
  formattedValues[10] = message[11]

  return formattedValues
}

export function decodeGlobals(message) {
  const formattedValues = []
  formattedValues[0] = message[0]
  formattedValues[1] = message[1]
  formattedValues[2] = message[2]
  formattedValues[3] = message[3]
  formattedValues[4] = message[4]
  formattedValues[5] = message[5]

  formattedValues[6] = decode8bitValue(message[6], message[7])
  formattedValues[7] = decode8bitValue(message[8], message[9])

  formattedValues[8] = message[10]

  return formattedValues
}
