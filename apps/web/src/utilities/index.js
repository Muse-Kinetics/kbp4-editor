// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import noteNames from '../constants/noteNames'
export * from './utilitiesMIDI'
export * from './utilitiesKey'
export * from './utilitiesPresets'
export * from './utilitiesFetching'
export * from './utilitiesStorage'
export * from './utilitiesCanvas'
export * from './utilitiesKeySensor'


export function formatClassNames(string) {
  return String(string).split(',').map(name => name.trim().toLowerCase().replace(/_+/g, '').replace(/\s+/g, '-')).join(' ')
}

export function midiNoteFormatter(value) {
	return (isNaN(value)) ? `${noteNames.indexOf(value)}       ${value}` : `${value}         ${noteNames[value]}`
}

export function inArray(set, index) {
	return set.includes(index)
}

export function itemIndex(set, item) {
	return set.indexOf(item)
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

/**
 * sets value to min / max if value is out of range
 * @function
 * @param {Object} DOM Element
 * @returns {Number}
 */
export function restrictNumber(element){
  let min = Number.isInteger(element.min) ? parseInt(element.min, 10) : parseFloat(element.min, 10),
      max = Number.isInteger(element.max) ? parseInt(element.max, 10) : parseFloat(element.max, 10),
      value = Number.isInteger(element.value) ? parseInt(element.value, 10) : parseFloat(element.value, 10)

  if(element.validity.valid) {
    return value
  } else if(value > max) {
    element.value = max
    return max
  } else if(value < min) {
    element.value = min
    return min
  }
}
/**
 * Capitalizes string
 * @function
 * returns {String}
 */
export function capitalize(string) {
  return string.toLowerCase().replace( /\b\w/g, (m) => m.toUpperCase())
}
