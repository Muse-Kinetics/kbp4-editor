// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export default function bootloaderHandler(event, device) {
  // use device.connection to determine port readiness
  // we only care about the output, ignore input connections
  // bootloader disconnect for status
  // if(!device.updatingFirmware) return
  // !! device ports go into connection = 'pending' on enterBootloader
  const bootloaderPort = event.port
  const {
      type,
      state,
      connection
  } = bootloaderPort
  // debug
  if(device._debug === 'midistate') console.log(`>> K-Board Pro 4 Bootloader (${type}): state: ${state}, connection: ${connection}`);
  // state & connection
  if(type === 'output') {
    if(state === 'connected'){
      switch(connection){
        case 'open':
          device.emit('bootloaderconnected')
          device.connection.bootloader.connected = true
          break;
        case 'closed':
          device.emit('bootloaderdisconnected')
          device.connection.bootloader.connected = false
          break;

        default:

      }
    } else if(state === 'disconnected') {
      // set disconnect message if bootloader initial connection
      device.emit('disconnect')
      device.emit('bootloaderdisconnected')
      device.connection.bootloader.connected = false
      return
    }
  } else if(type === 'input') {
    // ignore
    return
  }
}
