// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import midiMessageHandler from './midiMessageHandler'
import bootloaderHandler from './bootloaderHandler'
import deviceHandler from './deviceHandler'

import { isValidPort } from '../utilities'

export default function stateChangeHandler(event, device) {
	const portName = event.port.name

	if(!isValidPort(portName)) return

	if(portName.includes(device.deviceBootloaderName)) {
		// bootloader
		bootloaderHandler(event, device)
	} else {
		// device
		deviceHandler(event, device)
	}
}
