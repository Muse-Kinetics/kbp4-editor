// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export default function webmidi(access, logAccess = false){
  let midi = access, allDevices = [];

  function getPort(type, portName, report = true){
    const isBootloader = portName.toLowerCase().includes('bootloader')

    let devices = Array.from(midi[type].values()).filter(port => {
      if(isBootloader) {
        return port.name.includes(portName)
      } else {
        return port.name.includes(portName)
      }

      // return port.name === portName;
    });

    if(report && devices.length === 0) console.warn(`! >> webmidi: ${portName} ${type.replace('puts', 'put')} not found`);

    return devices[0];
  }

  return {
    getInput: (port, report) => getPort('inputs', port, report),
    getOutput: (port, report) => getPort('outputs', port, report)
  };
}
