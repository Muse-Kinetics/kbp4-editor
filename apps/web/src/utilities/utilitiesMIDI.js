// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { capitalize } from './'

export function pollPort(device, port, type, doesExist = true){
	console.log('>> K-Board Pro 4: searching for', port, type, ', until', (doesExist) ? 'connected': 'disconnected')
	return new Promise((accept, reject) => {
		let foundPort,
        poll = window.setInterval(() => {
          foundPort = device._ports[`get${capitalize(type)}`](port, false)

  			if(foundPort) {
  				clearInterval(poll);
  				accept(foundPort)
  			}
  		}, 250)
	})
}

export function isWindows() {
	if (typeof process !== "undefined" && process.platform === 'win32') {
		return true
	} else {
		return window.navigator &&
			window.navigator.platform &&
			window.navigator.platform.indexOf('Win') >= 0
	}
}

export function isWindows10() {
	return isWindows() && /Windows\s*\w*\s*10/g.test(window.navigator.platform)
}

export function isLinux() {
	if (typeof process !== "undefined" && process.platform === 'linux') {
		return true
	} else {
		return window.navigator &&
			window.navigator.platform &&
			window.navigator.platform.indexOf('Linux') >= 0
	}
}

// ignore non K-Board Pro 4 ports, Expander port
export function isValidPort(name, bootloader = true) {
	if (name.includes('K-Board Pro 4') && name.includes('Expander')) {
		return true
	} else if (name.includes('K-Board Pro 4 Bootloader')) {
		return bootloader ? true : false
	} else if (isWindows()) {
		return (name.includes('K-Board Pro 4') && !name.includes('MIDI')) || name.includes('Control Surface')
	} else if (isLinux()) {
		return name.includes('K-Board Pro 4') && name.includes('MIDI 1')
	} else {
		return name.includes('K-Board Pro 4') && name.includes('Control Surface')
	}
}