// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { logIf, isWindows, debounce } from '../utilities'

let portState = {
  state: [false, false],
  connection: [false, false]
},
allowPeripheralMessage = true

export default function deviceHandler(event, device) {
  const devicePort = event.port
  const {
      name,
      type,
      state,
      connection
  } = devicePort

  logIf(device._debug === 'midistate', `<< ${name} ${state} - ${type}: ${connection}`);

  // after bootloader initial set the device portname
  if(!device.portName) device.portName = name

  // set connection
	const portConnection = device.connection[type]

	// update connection status
	portConnection.connected = state === 'connected' ? true : false

  // when both ports are connected or both are disconnected
  portState.state[type === 'input' ? 0 : 1] = state
  portState.connection[type === 'input' ? 0 : 1] = connection

  const deviceState = getDeviceState(portState, state)
  const deviceConnection = getDeviceState(portState, connection)

  if(device._debug === 'midistate') console.log('<< portState:state', ...portState.state, ...portState.connection)
  logIf(device._debug === 'midistate', `<< deviceState: ${deviceState}`)
  logIf(device._debug === 'midistate', `<< deviceConnection: ${deviceConnection}`)

  // connect primary must be sent out ASAP
  if(isConnectPrimary(device, devicePort)) {
    logIf(device._debug === 'midistate', `<< ${device.deviceName}: connectprimary`)
    device.emit('connectprimary');
  }

  if(!device.initPorts && deviceConnection) {
    secondaryInit(device)
    if(device.connection.bootloader.initial){
      device.emit('centralupdatecomplete')
    }
  }

  const debounceReconnect = debounce(() => {
    device.emit('reconnect')
    logIf(device._debug === 'midistate', `<> reconnect`)
  }, 2000)

  if(deviceConnection && deviceState) {
    switch (deviceState) {
      case 'connected':
        if(isReconnect(device)) {
          if(device.updatingFirmware) {
            if(allowPeripheralMessage) device.emit('updateperipheralboards')
            allowPeripheralMessage = false;
          } else {
            if(deviceConnection === 'open') {
              debounceReconnect()
            }
          }
          if(device.input.connection !== 'open') device.input.open().then(p => console.log(`>> ${device.deviceName}: opening input: ${p.connection}`))
        }
        break;
      case 'disconnected':
        device.connection.input.previous = true
        device.connection.output.previous = true
        device.emit('disconnect')
        // TODO: reset these also when bootloader disconnects from bootloader initial

        portState = {
          state: [false, false],
          connection: [false, false]
        }
        allowPeripheralMessage = true

        logIf(device._debug === 'midistate', '<> disconnect')
        break;
      default:

    }
  }
  /*
  if(device.connection.bootloader.initial && !device.connection.bootloader.connected && !device.updatingFirmware) {
    portState = {
      state: [false, false],
      connection: [false, false]
    }
    allowPeripheralMessage = true
  }
  */
}

function isConnectPrimary(device, port) {
  const { input, bootloader } = device.connection
  const { type, state, connection } = port
  return !device.updatingFirmware &&
    type === 'input' &&
    state === 'connected' &&
    connection !== 'pending' &&
    !bootloader.initial &&
    !bootloader.connected &&
    input.initial &&
    !input.previous
}
/*
function isConnectSecondary(device, deviceConnection) {
  const { input, output } = device.connection
  return !input.initial &&
         !output.initial &&
         !input.previous &&
         !output.previous &&
         !device.initPorts
}
*/
function isReconnect(device) {
  const { input, output, bootloader } = device.connection
  return (input.previous && output.previous) || bootloader.initial
}

function getDeviceState(portState, state) {
  return (portState.state.every((s, i, a) => s === a[0])) ? state : null
}

function getDeviceConnection(portState, connection) {
  return (portState.connection.every((c, i, a) => c === a[0])) ? connection : null
}

function secondaryInit(device) {
  logIf(device._debug === 'midistate', `>> ${device.portName}: secondary init`)

  device._portInit()
}
