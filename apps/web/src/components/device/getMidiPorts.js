// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { isValidPort } from '../../utilities'

export default function getMidiPorts(access, callback) {
  const ports = [{ value: 'none', label: 'None', disabled: false }]
  access.outputs.forEach(port => {
    if (!isValidPort(port.name)) { // ignore K-Board Pro 4
      if(window._debug === 'midithru') console.log('>> get ports:', port.name, port.type)
      ports.push({
        value: port.name,
        label: port.name,
        port: port
      })
      // explicitly open port to send without implicit open
      port.open()
    }
  })
  // update port list in preferences
  callback()

  // return array for window.midithruports
  return ports
}

/*
access.outputs.forEach(port => {
  if (!isValidPort(port.name)) { // ignore K-Board Pro 4
    console.log('get ports', port.name, port.type)
    window.midithruports.push({
      value: port.name,
      label: port.name,
      port: port
    })
  }
})
// update port list in preferences
onRefreshThruPorts()
*/
