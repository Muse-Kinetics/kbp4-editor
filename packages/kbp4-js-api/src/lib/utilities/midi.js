// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { capitalize } from './format'

export function pollPort(device, port, type, autoOpen = false){
	const pollInterval = 500
	console.log(`>> FWU: searching for ${port} ${type} until connected ${autoOpen ? 'and opened' : ''}`);
	return new Promise((accept, reject) => {
		let foundPort,
        poll = window.setInterval(() => {
          foundPort = device._ports[`get${capitalize(type)}`](port, false)

  			if(foundPort) {
					if(autoOpen) {
						foundPort.open().then(port => accept(port))
					} else {
						accept(foundPort)
					}
					// clear poller
  				clearInterval(poll)
  			}
  		}, pollInterval)
	})
}

export function getDevicePorts(midi) {
	// if(midi.inputs.size === 0) return

	let inputs = midi.inputs.values(),
			outputs = midi.outputs.values(),
			testInputs = [],
			testOutputs = [],
			input, output,
			devicePortOutputID,
			devicePortInput, devicePortOutput

	return new Promise((resolve, reject) => {
		for(input = inputs.next(); input && !input.done; input = inputs.next()){
			// ignore Bootloader input
			if(input.value.name === 'K-Board Pro 4 Bootloader') break

			testInputs.push(input.value)

			input.value.onmidimessage = event => {
				const message = event.data
				// test response
				if(message[0] === 240 && message[5] === 37) {
					devicePortInput = event.target
					// get matching output
					devicePortOutput = testOutputs.filter(o => o.name === devicePortInput.name)[0]
					// clear listeners
					testInputs.forEach(i => i.onmidimessage = undefined)
					// resolve ports
					resolve([devicePortInput, devicePortOutput])
				}
			}
		}
		// meh...
		setTimeout(() => {
			if(!devicePortInput && inputs.next().done) {
				resolve(false)
			}
		}, 1000)

		for(output = outputs.next(); output && !output.done; output = outputs.next()){
			if(output.value.name === 'K-Board Pro 4 Bootloader') {
				resolve(output.value)
				break
			}

			testOutputs.push(output.value)
			// send device id request
			output.value.send([240, 0, 1, 95, 122, 37, 1, 1, 16, 247])
		}
	})
}

/*
	Mac:
		K-Mix: `K-Mix Control Surface`
		K-Board Pro 4: `K-Board Pro 4 Control Surface`
	Windows:
		K-Mix: `Control Surface` || `Control Surface [0]`
		K-Board Pro 4: 'K-Board Pro 4' || '3 - Control Surface'

	for windows we have to use the device ID request
*/
