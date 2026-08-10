// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// import { ipcRenderer, remote } from 'electron'
// import isElectron from 'is-electron'
import { Component } from 'react'
import { connect } from 'react-redux'
import KBoardPro4 from 'kbp4-js-api'
import { updatedDiff } from 'deep-object-diff'
import isEmpty from 'lodash.isempty'

import { newPreset, addToPreset, getPreset } from '../presetBuilding'
import { buildMessage, setCanvasDimensions } from '../../utilities'

import visualizer from '../visualizer/'
import getMidiPorts from './getMidiPorts'
// import sound from '../sound/'

import {
  networkStatus,
  deviceConnection,
  setBootloaderMode,
  firmwareUpdateComplete,
  firmwarePeripheralProgress,
  firmwareUpdateError,
  devicePresetsLoaded,
  setStatusMessage,
  addPreset,
  setVisualizerState,
  selectUI,
  refreshThruPorts
} from '../../actions/'

// const { Menu } =  remote

// If a firmware update makes no forward progress for this long (no bootloader
// ready / no peripheral board reporting), treat it as failed. This catches the
// known case where an octave's MCU is unresponsive and only some boards update.
const FW_WATCHDOG_MS = 30000

const FW_FAILURE_MESSAGE = 'The firmware update could not finish. One or more octaves did not respond, which can happen if an octave needs service. Your K-Board Pro 4 is safe to unplug and try again.'

class KBoardPro4Listener extends Component {
  KBoardPro4 = null
  isUISync = false
  _fwWatchdog = null

  // (Re)start the firmware watchdog. Called when an update begins and reset on
  // every unit of forward progress (bootloader ready, each peripheral board).
  armFwWatchdog = () => {
    this.clearFwWatchdog()
    this._fwWatchdog = setTimeout(() => {
      this.props.onFirmwareUpdateError(FW_FAILURE_MESSAGE)
    }, FW_WATCHDOG_MS)
  }

  clearFwWatchdog = () => {
    if(this._fwWatchdog) {
      clearTimeout(this._fwWatchdog)
      this._fwWatchdog = null
    }
  }

  // The renderer can't touch the native menu directly under contextIsolation;
  // the main process owns the Hardware > Update Firmware item and toggles it via
  // this IPC channel. No-op in a plain browser (no window.ipcRenderer).
  setFirmwareMenuEnabled = (enabled) => {
    if(window.ipcRenderer && typeof window.ipcRenderer.send === 'function') {
      window.ipcRenderer.send('menu-update-firmware', { enabled })
    }
  }

  componentDidMount() {
    try {
      navigator.requestMIDIAccess({sysex: true}).then(access => {
        const {
          onConnection,
          onReconnection,
          onDisconnection,
          onSetStatusMessage,
          onSetBootloaderMode,
          onDevicePresetsLoaded,
          onFirmwareUpdateComplete,
          // onSetVisualizerState,
          onSelectUI,
          onAddPreset,
          onRefreshThruPorts
        } = this.props

        this.KBoardPro4 = new KBoardPro4(access, false)
        // set global reference to KBoardPro4
        window.KBoardPro4 = this.KBoardPro4

        //: Midi Thru
        window.midithruports = [{value: 'none', label: 'None' }]
        // listen for new ports
        access.addEventListener('statechange', (e) => {
          if(e.port.type === 'input') return
          // update port collection
          window.midithruports = getMidiPorts(access, onRefreshThruPorts)
        })

        // set if in bootloader mode on connection
        if(this.KBoardPro4.connection.bootloader.connected) {
          onSetBootloaderMode(true)
          onSetStatusMessage('Bootloader - Update Firmware!')
          /*
          if(isElectron()){
            const menu = Menu.getApplicationMenu()
            menu.getMenuItemById('update_firmware').enabled = true
           }
          */
        }

        // setup device message listeners
        // : connect
        this.KBoardPro4.once('connectprimary', () => {
          onConnection('connected')
          console.log('>> K-Board Pro 4: connect:primary');
        })
        // secondaryconnect
        this.KBoardPro4.once('connectsecondary', () => {
          console.log('>> K-Board Pro 4: connect:secondary');
          onConnection('connected')
          /*
          if(isElectron()){
            const menu = Menu.getApplicationMenu()
            menu.getMenuItemById('update_firmware').enabled = true
           }
           */
        })
        // reconnect
        this.KBoardPro4.on('reconnect', () => {
          console.log('>> K-Board Pro 4: reconnected');
          onReconnection('reconnected')
          /*
          if(isElectron()){
            const menu = Menu.getApplicationMenu()
            menu.getMenuItemById('update_firmware').enabled = true
           }
           */
        })
        // : disconnection
        this.KBoardPro4.on('disconnect', () => {
          console.log('>> K-Board Pro 4: disconnected');
          onDisconnection(this.props.updatingFirmware ? 'updatingfirmware' : 'disconnected')
          if(this.props.bootloaderMode) onSetBootloaderMode(false)
          /*
          if(isElectron()){
            const menu = Menu.getApplicationMenu()
            menu.getMenuItemById('update_firmware').enabled = false
           }
           */
        })

        // firmware updating — reset the watchdog on each unit of progress
        this.KBoardPro4.on('bootloaderready', () => this.armFwWatchdog())
        this.KBoardPro4.on('updateperipheralboards', () => this.armFwWatchdog())

        this.KBoardPro4.on('firmwareupdatecomplete', () => {
          console.log('>> FWUD: complete');
          this.clearFwWatchdog()
          onFirmwareUpdateComplete()

          /*
          if(isElectron()){
            const menu = Menu.getApplicationMenu()
            menu.getMenuItemById('update_firmware').enabled = true
           }
           */
        })
        // post firmware — advance the peripheral progress (51-100%) per board
        this.KBoardPro4.on('peripheralready', (board) => {
          console.log(`>> K-Board Pro 4: peripheral board ${board} ready`)
          this.props.onPeripheralProgress(this.KBoardPro4.updatedBoards)
          this.armFwWatchdog()
        })

        //  : presets
        this.KBoardPro4.on('presetbegin', (begin) => newPreset(begin))
        this.KBoardPro4.on('presetparam', (param) => addToPreset(param))
        this.KBoardPro4.on('presetend', (end) => {
          onAddPreset('device', getPreset())
          if(end.values[0] === 4) onDevicePresetsLoaded(true)
        })

        // midi notes for selecting bars
        this.KBoardPro4.on('midi', (midi) => {
          // log midi to the console
          if(window.showMIDI) console.log(`>> ${String.fromCharCode('9836')} midi`, midi, 'channel:', midi[0] & 0x0f);

          // update visualizer
          visualizer(midi, this.props.currentPreset)

          // midi thru
          try {
            if (window.kbp4thru && this.props.midithruport !== 'none') {
              window.kbp4thru.send(midi)
            }
          } catch(e) {
            console.error('>> K-Board Pro 4 Editor: unable to connect to Thru port', e)
          }

          // enable / disable synth
          // if(this.props.synthEnabled) sound(midi)
          /*
          if(!this.props.visualzerActive && (midi[0] & 0xf0) === 144){
            onSetVisualizerState(true)
          } else if(this.props.visualzerActive && (midi[0] & 0xf0) === 128) {
            onSetVisualizerState(false)
          }
          */
        })

        // UI Sync
        this.KBoardPro4.on('ui', (control) => {
          this.isUISync = true
          onSelectUI(control, this.props.presets)
        })
      })
    } catch(e) {
      console.warn('>> Web MIDI API is unsupported in this browser');
      alert("This browser doesn't currently support WebMIDI, please use Chrome, Edge, Brave, or Opera")
      this.props.onSetStatusMessage('web midi unsupported')
    }

    // set canvas dimensions
    setCanvasDimensions()
  }

  componentDidUpdate(previousProps) {
    // firmware watchdog: arm when an update begins, clear when it finishes/errors
    if(!previousProps.updatingFirmware && this.props.updatingFirmware) {
      this.armFwWatchdog()
    }
    if(previousProps.firmwareStage !== this.props.firmwareStage &&
       ['complete', 'error', 'idle'].includes(this.props.firmwareStage)) {
      this.clearFwWatchdog()
    }

    // keep the native Hardware > Update Firmware menu item in sync with the
    // in-app enable condition (device connected/bootloader, not mid-update)
    const allow = (this.props.deviceConnected || this.props.bootloaderMode) && !this.props.updatingFirmware
    const prevAllow = (previousProps.deviceConnected || previousProps.bootloaderMode) && !previousProps.updatingFirmware
    if(allow !== prevAllow) {
      this.setFirmwareMenuEnabled(allow)
    }

    const difference = updatedDiff(previousProps.currentPreset, this.props.currentPreset)

    if(
      !isEmpty(difference) &&
      Object.keys(difference).length === 1 && // difference > 1 means entire preset, ignore
      !difference.name
    ) {
      if(this.KBoardPro4 && this.KBoardPro4.isConnected()){
        // handle multiple params from one group
        const messages = buildMessage(difference, this.props.currentPreset, this.props.selectedZone)
        // process all messages
        messages.forEach(message => {
          const [ param, values ] = message

          if(!this.isUISync) {
            console.log('>> K-Board Pro 4 Editor: send param', param, 'values', values);
            // send device param update
            this.KBoardPro4.setParam(param, values)
          }
          this.isUISync = false
        })
      } else {
        // console.clear()
        console.warn(`>> K-Board Pro 4 Editor: cannot update ${Object.keys(difference)} on K-Board Pro 4, device not connected`)
      }
    } else {
      // this also triggers on editor state changes
      // maybe this can trigger some action for preset change?
      // console.log('>> editor: currentPreset change');
    }
    // update networkStatus
    this.props.onSetNetworkStatus()
  }

  componentWillUnmount() {
    this.clearFwWatchdog()
    try {
      // cleanup event handlers
      this.KBoardPro4 && this.KBoardPro4.removeAllListeners()
    } catch(err) {
        console.warn('>> something went wrong');
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    deviceConnected: state.device.connected,
    bootloaderMode: state.device.bootloaderMode,
    updatingFirmware: state.device.updatingFirmware,
    firmwareStage: state.device.firmwareStage,
    synthEnabled: state.editor.synthEnabled,
    selectedZone: state.editor.selectedZone,
    visualzerActive: state.editor.visualzerActive,
    midithruport: state.editor.midithruport,
    currentPreset: state.currentPreset,
    presets: state.presets
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // update online status
    onSetNetworkStatus: () => dispatch(networkStatus()),
    // set connection status
    onConnection: (status) => dispatch(deviceConnection(status)),
    // { onConnection : deviceConnection }
    onDisconnection: (status) => dispatch(deviceConnection(status)),
    // { onDisconnection : deviceConnection }
    onReconnection: (status) => dispatch(deviceConnection(status)),
    // { onReconnection : deviceConnection }
    onSetBootloaderMode: (active) => dispatch(setBootloaderMode(active)),
    // { onSetBootloaderMode: setBootloaderMode }
    onFirmwareUpdateComplete: () => dispatch(firmwareUpdateComplete()),
    // { onReconnection : deviceConnection }
    onPeripheralProgress: (boardsUpdated) => dispatch(firmwarePeripheralProgress(boardsUpdated)),
    onFirmwareUpdateError: (message) => dispatch(firmwareUpdateError(message)),
    onSetStatusMessage: (status) => dispatch(setStatusMessage(status)),
    // presets
    onAddPreset: (category, preset) => dispatch(addPreset(category, preset)),
    // { onAddPreset : addPreset }
    onDevicePresetsLoaded: (status) => dispatch(devicePresetsLoaded(status)),
    // { onSetVisualizerState : setVisualizerState }
    onSetVisualizerState: (state) => dispatch(setVisualizerState(state)),
    // { onSelectUI : selectUI }
    onSelectUI: (control, presets) => dispatch(selectUI(control, presets)),
    // { onRefreshThruPorts : refreshThruPorts }
    onRefreshThruPorts: () => dispatch(refreshThruPorts())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KBoardPro4Listener)
