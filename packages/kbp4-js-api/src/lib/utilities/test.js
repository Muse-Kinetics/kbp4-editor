// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
/**
 * checks if item is object
 * @function
 * @param {Object} x - object
 * @returns {Boolean} result of check
 */
export function isObject(val) {
	return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/**
 * checks if number is float
 * @function
 * @param {Number} n - number
 * @returns {Boolean} result of check
 */
export function isFloat(n){
  return Number(n) === Number(n) && Number(n) % 1 !== 0;
}

export function isOdd(v, i){
  return (i % 2)
}

export function isEven(v, i){
  return !(i % 2)
}

export function notUndefined(i){
  return i !== undefined
}
export function notEmpty(i){
  return i !== "" && i !== " "
}
export function notNegative(i){
  return isNaN(i) ? true : i >= 0;
}

export function isWindows() {
	if(typeof process !== "undefined" && process.platform === 'win32') {
		return true
	} else {
		return window.navigator &&
					 window.navigator.platform &&
					 window.navigator.platform.indexOf('Win') >= 0
	}
}

export function isWindows10(){
	return isWindows() && /Windows\s*\w*\s*10/g.test(window.navigator.platform)
}

export function isLinux(){
	if(typeof process !== "undefined" && process.platform === 'linux') {
		return true
	} else {
		return window.navigator &&
					 window.navigator.platform &&
					 window.navigator.platform.indexOf('Linux') >= 0
	}
}

// ignore non K-Board Pro 4 ports, Expander port
export function isValidPort(name, bootloader = true) {
	if(name.includes('Expander')){
		return false
	} else if(name.includes('K-Board Pro 4 Bootloader')) {
		return bootloader ? true : false
	} else if(isWindows()) {
		return (name.includes('K-Board Pro 4') && !name.includes('MIDI')) || name.includes('Control Surface')
	} else if(isLinux()) {
		return name.includes('K-Board Pro 4') && name.includes('MIDI 1')
	} else {
		return name.includes('K-Board Pro 4') && name.includes('Control Surface')
	}
}
