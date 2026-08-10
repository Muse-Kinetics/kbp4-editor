// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import EventEmitter from 'eventemitter3'
// constants
import deviceMessages from './lib/constants/deviceMessages'
import * as address from './lib/constants/addresses'
import presetParams from './lib/constants/presetParams'
// builders
import buildSysexMessage from './lib/builders/buildSysexMessage'
import buildSendPreset from './lib/builders/buildSendPreset'
// eventHandlers
import midiMessageHandler from './lib/eventHandlers/midiMessageHandler'
import stateChangeHandler from './lib/eventHandlers/stateChangeHandler'
// webmidi
import webmidi from './lib/webmidi'
// utilities
import { isValidPort, isWindows, camelToUnder, logIf, pollPort } from './lib/utilities'
// version
import { version } from '../package.json'

export default class KBoardPro4 extends EventEmitter {
  constructor(access = {}, debug = false){
    super()

    this.version = version

    this.deviceName = 'K-Board Pro 4'
    this.portName = null
    this.deviceBootloaderName = `${this.deviceName} Bootloader`
    this.bootloader = null

    this.connection = {
      input: {
        initial: false,
        previous: false,
        connected: false
      },
      output: {
        initial: false,
        previous: false,
        connected: false
      },
      bootloader: {
        initial: false,
        connected: false
      }
    }

    this._midi = access
    this._debug = debug
    this.initPorts = false

    this.updatingFirmware = false
    this.updatedBoards = 0

    // set port connections
    this._midi.inputs.forEach(input => {
      if(isValidPort(input.name, false)) {
        // set OS specific portName
        this.portName = input.name

        this.connection.input.connected = input.state === 'connected' ? true : false
        this.connection.input.initial = input.state === 'connected' ? true : false
      } else {
        //ignore expander, 2nd port, bootloader
        return;
      }
    })

    this._midi.outputs.forEach(output => {
      if(isValidPort(output.name, true)) {
        if(output.name.includes(this.deviceBootloaderName)) {
          this.connection.bootloader.initial = true;
          this.connection.bootloader.connected = true;
          // this.updatingFirmware = true
          // assign port if bootloader initial
          this.bootloader = output
          // does this need to be called?
          this.emit('bootloader', true)
        } else {
          this.connection.output.connected = output.state === 'connected' ? true : false
          this.connection.output.initial = output.state === 'connected' ? true : false
        }
      } else {
        //ignore expander, 2nd port
        return;
      }
    })

    // setup state change handler
    this._midi.onstatechange = (event) => stateChangeHandler(event, this)
    // get ports from webmidi
    this._ports = webmidi(this._midi, this._debug)
    // initial ports
    this._portInit()
  }

  _portInit() {
    const { input, output, bootloader } = this.connection

    if(input.connected && output.connected) {
      logIf(this._debug === 'midistate', `>> ${this.deviceName} - ${this.portName} : Port init`)
      // TODO: check if there is an issue here with k-mix control surface
      this.input = this._ports.getInput(this.portName)
      this.output = this._ports.getOutput(this.portName)

      // set midi message handler
      if(this.input && !this.input.onmidimessage) {
        this.input.onmidimessage = (event) => midiMessageHandler(event, this)
      }

      if(!input.initial && !output.initial && !input.previous && !output.previous) {
        // connect:secondary
        this.emit('connectsecondary')
      }
      // set initPorts flag
      this.initPorts = (this.input && this.output && this.input.onmidimessage) ? true : false
    } else if(bootloader.connected) {
      logIf(this._debug === 'midistate', `>> ${this.deviceBootloaderName}: connected`)
      this.initPorts = false
    } else {
      logIf(this._debug === 'midistate', `>> ${this.deviceName}: not connected`, 'warn')
      this.initPorts = false
    }
  }

  _buildMessage(paramName, paramValues = undefined) {
    const param = camelToUnder(paramName),
          values = (paramValues === undefined) ? undefined : (paramName !== 'name') ? paramValues.trim().split(',') : [paramValues.trim()]

    const message = buildSysexMessage(param, values)
    logIf(this._debug === 'message', `>> message - ${paramName}: ${message}`)
    return message
  }

  getFirmwareVersion() {
    const message = this._buildMessage(address.VERSIONS)
    this.send(message)
  }

  enterBootloader() {
    const { bootloader } = this.connection

    if(!bootloader.initial) {
      this.input.close()
        .then(() => {
          console.log(`>> ${this.deviceName}: sending enter bootloader message`)
          this.send(deviceMessages.enter_bootloader)
          this.output.close()
        })
    }
    // init flags
    // this.updatingFirmware = true
    // this.updatedBoards = 0
    // start polling to connect to bootloader
    pollPort(this, this.deviceBootloaderName, 'output', true)
      .then(port => {
        // init flags
        this.updatingFirmware = true // unclear if this needs to get set earlier
        this.updatedBoards = 0
        // if bootloader initial don't re-assign the port
        if(!bootloader.initial) {
          this.bootloader = port;
        }

        this.connection.bootloader.connected = true;
        this.emit('bootloaderready')

        // start searching for device ports
        this.once('centralupdatecomplete', () => {
          Promise.all([
            pollPort(this, this.portName, 'input', true),
            pollPort(this, this.portName, 'output', true)
          ]).then(([inputPort, outputPort]) => {
            // After the central reboot the device re-enumerates its normal
            // ports. pollPort found + opened them above but the result was
            // previously discarded, so this.input/this.output could still point
            // at the pre-bootloader port objects and the freshly-opened input
            // had no onmidimessage handler -> peripheral-board replies
            // (SYX_PERIPHERAL_PRESENT) were silently dropped and the flash
            // stalled before all 4 boards reported. Explicitly re-bind to the
            // freshly re-enumerated ports and (re)attach a persistent handler.
            if(inputPort) {
              this.input = inputPort
              this.input.onmidimessage = (event) => midiMessageHandler(event, this)
            }
            if(outputPort) this.output = outputPort
            console.log(`>> ${this.deviceName}: central firmware updated, reconnected on device port`)
            // central board updated, closing bootloader port
            this.bootloader.close().then(() => {
              this.bootloader = null
              this.connection.bootloader.connected = false
              this.connection.bootloader.initial = false
            }).catch(err => logIf(true, `>> ${this.deviceBootloaderName} could not close`, `error`))
          })
        })
        // if starting in bootloader allow for FWU completion
        if(!bootloader.initial) this.emit('centralupdatecomplete')
    })
  }

  sendFWUStatus(status = 'failed') {
    // post FWU
    // 'success' || 'failed'
    this.FWUStatus = status
  }

  isConnected() {
    return this.connection.input.connected && this.connection.output.connected ? true : false
  }

  reset() {
    logIf(true, `>> ${this.deviceName}: resetting on-device presets and user tables to factory defaults`, `warn`)
    this.send(deviceMessages.reset_presets)
    this.send(deviceMessages.reset_user_tables)
  }

  getSensorBank(bankIndex) {
    const message = this._buildMessage('get_sensor_bank', String(bankIndex))
    this.send(message)
  }

  eraseSensorBank(bankIndex) {
    const message = this._buildMessage('erase_sensor_bank', String(bankIndex))
    this.send(message)
  }
  // audition, write sensor
  setSensor(sensorParams) {
    const message = this._buildMessage('set_sensor', `${sensorParams}`)
    logIf(this._debug === 'message', `>> ${this.deviceName}: set sensor - ${sensorParams}`)
    this.send(message)
  }

  recalculateSensorData() {
    const message = this._buildMessage('recalc_sensor_data')
    logIf(this._debug === 'message', `>> ${this.deviceName}: recalculate sensor calibration data`)
    this.send(message)
  }

  sendSolo(soloMessage) {
    const message = this._buildMessage('send_solo', `${soloMessage}`)

    this.send(message)
  }

  getUserCurve(curveIndex = '1') {
    const message = this._buildMessage('get_curve', String(curveIndex))

    this.send(message)
  }

  saveUserCurve(curveIndex, curve) {
    const message = this._buildMessage('save_curve', String(curveIndex) + ',' + String(curve))

    this.send(message)
  }

  setParam(paramName, paramValues) {
    logIf(this._debug === 'param', `>> ${this.deviceName}: set ${paramName} ${paramValues}`)
    const message = this._buildMessage(paramName, paramValues)

    this.send(message)
  }

  getPreset(presetIndex = '1') {
    const message = this._buildMessage(address.GETPRESET2, String(presetIndex))
    this.send(message)
  }

  getPreset1(presetIndex = '1') {
    const message = this._buildMessage(address.GETPRESET, String(presetIndex))
    this.send(message)
  }

  // currently not implemented
  loadPreset(presetIndex = '1') {
    // if on-device preset : load flash preset to the edit buffer [1-4]
    const message = this._buildMessage(address.LOADPRESET, String(presetIndex))
    this.send(message)
  }

  savePreset(presetIndex = '1') {
    // save edit buffer to flash [1-4]
    const message = this._buildMessage(address.SAVEPRESET, String(presetIndex))
    this.send(message)
  }

  sendPreset(presetObject = {}) {
    // don't send presets to the device during a firmware update
    if(this.updatingFirmware) return
    // on preset select : editor to edit buffer
    // logIf(this._debug === 'preset', `>> ${this.deviceName}: sendPreset ${presetObject}`)
    if(this._debug === 'preset') console.log('>> ' + this.deviceName + ' : sendPreset', presetObject);
    // build sysex message from preset object
    const messages = buildSendPreset(presetObject)
    // loop and send to edit buffer
    messages.forEach(messageObject => {
      this.setParam(messageObject.param, messageObject.values)
    })
  }

  send(message = [])
  {
      if (!this.isConnected())
      {
          //(0, _utilities.logIf)(true, `>> ${this.deviceName}: cannot send message, try reconnecting`, `warn`);
          return;
      }

      // The Web MIDI API requires every MIDIOutput.send() call to be a COMPLETE
      // MIDI message that begins with a status byte (>= 0x80). The old path here
      // sliced large messages into fixed 64-byte chunks and sent each slice on
      // its own; every slice after the first started on a data byte, so the
      // browser rejected it with "Running status is not allowed at index 0".
      // Firmware .syx assets are single monolithic SysEx (F0 ... F7) messages,
      // so they must be delivered as whole SysEx packets, not raw byte slices.
      const bytes = Array.from(message);

      // Small control messages: send as-is.
      if (bytes.length <= 64)
      {
          this.output.send(bytes);
          return;
      }

      // Split the payload into complete SysEx packets on 0xF7 boundaries. A
      // single monolithic firmware sysex yields one packet (sent whole); a
      // pre-chunked multi-packet asset yields one send() per complete packet.
      const packets = [];
      let start = 0;
      for (let i = 0; i < bytes.length; i++)
      {
          if (bytes[i] === 0xF7)
          {
              packets.push(bytes.slice(start, i + 1));
              start = i + 1;
          }
      }
      // Trailing bytes with no closing F7 (non-sysex or malformed): send as-is.
      if (start < bytes.length) packets.push(bytes.slice(start));

      // Stagger packets by 1ms each to preserve the original send pacing.
      packets.forEach((packet, index) =>
      {
          setTimeout(() => this.output.send(packet), index);
      });
  }
}
