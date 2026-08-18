// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import isElectron from 'is-electron'
import compareVersions from 'compare-versions'

import paths from '../constants/deviceResourcePaths.js'
import midiMessageTypesTable from '../constants/midiMessageTypesTable.js'
import { deviceVersions, asyncFetchBuffer, getBuffer, isWindows } from '../utilities'

import {
  DEVICE_UPDATE_FIRMWARE,
  FETCH_FIRMWARE,
  DEVICE_ENTER_BOOTLOADER,
  BOOTLOADER_READY,
  BOOTLOADER_DISCONNECT,
  SEND_FIRMWARE_CENTRAL,
  SEND_FIRMWARE_PERIPHERAL,
  FIRMWARE_PERIPHERAL_PROGRESS,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_DISMISS,
  FIRMWARE_UPDATE_UNSUPPORTED_PLATFORM,
  PERIPHERAL_READY,
  DEVICE_REQUEST_FIRMWARE_VERSIONS,
  DEVICE_REQUEST_PRESET,
  DEVICE_REQUEST_USER_CURVE,
  DEVICE_LOAD_PRESET_TO_BUFFER,
  DEVICE_SAVE_PRESET_TO_MEMORY,
  DEVICE_SAVE_USER_CURVE,
  DEVICE_SEND_PRESET_TO_BUFFER,
  DEVICE_UPDATE_BUFFER_PRESET_NAME,
  SENSORS_LOADED,
  DEVICE_REQUEST_SENSOR_BANK,
  DEVICE_ERASE_SENSOR_BANK,
  DEVICE_WRITE_SENSOR_BANK,
  DEVICE_AUDITION_SENSOR,
  DEVICE_WRITE_SENSOR,
  DEVICE_RECALCULATE_SENSORS,
  RESET_OVERRIDES,
  SEND_SOLO_MESSAGE,
  DEVICE_RESET,

  // editor actions. should these be moved?
  CONNECT,
  DISCONNECT,
  RECONNECT,
  FIRMWARE_UPDATE_COMPLETE,
  SET_FIRMWARE_VERSION,
  SET_FIRMWARE_UPDATE_AVAILABLE,
  SET_CURRENT_PRESET,
  SELECT_PRESET,
  SET_BOOTLOADER_MODE
} from './actionTypes'

import {
  setCurrentPreset,
  setRevertablePreset,
  setUserCurve,
  setKeySensor,
  setOverrideSensor,
  selectVelocityCurve,
  setStatusMessage,
  setUpdatesAvailable,
  resetDevicePresetStore,
  resetUserCurveStore,
  devicePresetsLoaded,
  updateCurrentPresetName
} from '../actions/'

// should probably have this be in one place
const internalFirmwareCentralPath = './firmware/k-board-pro-4-central-v1.2.2.0.syx',
      internalFirmwarePeripheralPath = './firmware/k-board-pro-4-peripheral-v1.2.2.0.syx'

// Device Connections
export const deviceConnection = (status) => {
  return (dispatch, getState) => {
    switch (status) {
      case 'connected': {
        const updatingFirmware = window.KBoardPro4.updatingFirmware
        if(!updatingFirmware) {
          dispatch({ type: CONNECT })
          dispatch(setStatusMessage(status))
          dispatch(requestFirmwareVersion())
        }
      }
        // if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.editorConnect()
        break;
      case 'disconnected':
        dispatch({ type: DISCONNECT })
        dispatch(setStatusMessage(status))
        dispatch(devicePresetsLoaded(false))
        dispatch(resetDevicePresetStore())
        dispatch(setFirmwareVersion({
          firmware: '0.0.0.0',
          bootloader: '0.0.0.0'
        }))

        const presets = getState().presets,
              requiredFirmwareVersion = getState().device.minimumCompatibleFirmwareVersion
        let nextPreset, nextSelectPresetID

        if(presets.user.length && compareVersions(presets.user[0].preset_version.join('.'), requiredFirmwareVersion) >= 0) {
          nextSelectPresetID = 'user-0'
          nextPreset = { ...presets.user[0] }
        } else if(presets.factory.length) {
          nextSelectPresetID = 'factory-0'
          nextPreset = { ...presets.factory[0] }
        } else {
          // load what?
          // disable all UI?
          // load initial?
        }

        if(compareVersions(nextPreset.preset_version.join('.'), requiredFirmwareVersion) < 0){
          console.log(`K-Board Pro 4 Editor: incompatible preset version ${nextPreset.preset_version}, version ${requiredFirmwareVersion} or higher required`);
        } else {
          dispatch(setCurrentPreset(nextPreset, nextSelectPresetID))
        }

        /*
        dispatch(setRevertablePreset(false))
        dispatch(selectZone(0))
        dispatch({ type: SET_CURRENT_PRESET, preset: nextPreset })
        dispatch({ type: SELECT_PRESET, selectedPreset: nextSelectPresetID })
        dispatch(setRevertablePreset(false))
        */
        // if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.editorDisconnect()
        break;
      case 'reconnected': {
        const updatingFirmware = window.KBoardPro4.updatingFirmware,
              messageTimeout = 1500

        dispatch({ type: RECONNECT })
        dispatch(setStatusMessage('reconnecting'))
        window.setTimeout(() => dispatch(setStatusMessage('connected')), messageTimeout)
        if(!updatingFirmware){
          dispatch(requestFirmwareVersion())
        } else {
          console.log(">> K-Board Pro 4: updating peripheral board firmware...");
        }
      }
        // if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.editorConnect()
        break;
      case 'updatingfirmware':
        dispatch({ type: DISCONNECT })
        dispatch(setStatusMessage('updating firmware'))
        dispatch(devicePresetsLoaded(false))
        dispatch(resetDevicePresetStore())
        // if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.editorDisconnect()
        break;
      default:

    }
  }
};

// Presets
export const requestPreset = (index) => {
  if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.getPreset(index)
  return { type: DEVICE_REQUEST_PRESET, index: index }
};

export const loadPreset = (memoryIndex) => {
  if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.loadPreset(memoryIndex)
  return { type: DEVICE_LOAD_PRESET_TO_BUFFER }
};

export const sendPreset = (preset) => {
  if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.sendPreset(preset)
  return { type: DEVICE_SEND_PRESET_TO_BUFFER }
};

export const savePreset = (destination) => {
  return (dispatch, getState) => {
    const { name: currentPresetName } = getState().currentPreset,
          devicePresets = getState().presets.device

    if(devicePresets.some(p => p.name === currentPresetName)){
      let nameVersion = currentPresetName.match(/v.\d/g)
      if(!!nameVersion) {
        let vString = nameVersion[0],
            v = parseInt(nameVersion[0].split('v.')[1])

        dispatch(updatePresetName(`${currentPresetName.replace(vString, '')} v.${v + 1}`))
        dispatch(updateCurrentPresetName(`${currentPresetName.replace(vString, '')} v.${v + 1}`))
      } else {
        dispatch(updatePresetName(`${currentPresetName} v.1`))
        dispatch(updateCurrentPresetName(`${currentPresetName} v.1`))
      }
    }

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.savePreset(destination)
    dispatch(setRevertablePreset(false))
    dispatch(resetDevicePresetStore())
    dispatch(requestPreset('1'))
    dispatch(requestPreset('2'))
    dispatch(requestPreset('3'))
    dispatch(requestPreset('4'))
    dispatch({ type: DEVICE_SAVE_PRESET_TO_MEMORY})
  }
};

export const updatePresetName = (name) => {
  if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.setParam('name', name)
  return {type: DEVICE_UPDATE_BUFFER_PRESET_NAME, name: name}
}

// User Curves
export const requestUserCurve = (curveIndex) => {
  return (dispatch) => {
    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      window.KBoardPro4.once('usercurve', (paramObj) => {
        const { index, curve } = paramObj
        dispatch(setUserCurve(index, curve))
      })

      window.KBoardPro4.getUserCurve(curveIndex)
    }

    dispatch({ type: DEVICE_REQUEST_USER_CURVE, index: curveIndex })
  }
};

export const saveUserCurve = (index, curve) => {
  return (dispatch) => {
    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.saveUserCurve(index, new Uint8Array(curve))
    dispatch({ type: DEVICE_SAVE_USER_CURVE, index: index, curve: curve })
    dispatch(setUserCurve(index, curve))
    dispatch(requestUserCurve('0'))
    setTimeout(() => dispatch(requestUserCurve('1')), 100)
    setTimeout(() => dispatch(requestUserCurve('2')), 200)
    setTimeout(() => dispatch(requestUserCurve('3')), 300)
    dispatch(selectVelocityCurve(-1))
  }
};

// Per Key Sensor Gain
export const requestSensorBanks = () => {
  /*
    TODO:
    build complete keySensors object and then set to state
  */
  const BANKS = 2, SENSORS = 48 * 12, KEY_SENSORS = 48 * 3
  let sensorKeyCount = 0, sensorCount = 0

  return (dispatch) => {
    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      // reset overrides
      dispatch({type: RESET_OVERRIDES})
      // reset loaded flag
      dispatch({ type: SENSORS_LOADED, loaded: false })
      // Key Sensor Data
      // 96 = 2 * 48
      // gang_type, mem_loc, octave, key, side, value
      window.KBoardPro4.on('sensorkeydata', (paramObj) => {
        const { values, override } = paramObj
        const [gangType, bankIndex, ...keySensorValues] = values.split(',').map(Number)
        const gangBank = `${gangType}|${bankIndex}`;
        sensorKeyCount++
        // console.log(`>> sensor key ${sensorKeyCount} : ${values}`);
        if(sensorKeyCount === KEY_SENSORS) console.log('>> K-Board Pro 4: Sensor Keys Loaded');

        dispatch(setKeySensor(values))

        if(override) {
          console.log('>> K-Board Pro 4: sensor key override', values);
          dispatch(setOverrideSensor(gangBank,keySensorValues.join(','),0));
        }
      })

      // Sensor Data
      // sensorCount: 576 = 12 * 48
      // gang_type, mem_loc, octave, key, side, sensor, value
      window.KBoardPro4.on('sensordata', (paramObj) => {
        const { values, override } = paramObj
        const [gangType, bankIndex, ...sensorValues] = values.split(',').map(Number)
        const gangBank = `${gangType}|${bankIndex}`;
        sensorCount++
        // console.log(`>> sensor ${sensorCount} : ${values}`);
        if(sensorCount === SENSORS * BANKS) console.log('>> K-Board Pro 4: Sensors Loaded');
        // gang,bank,octave,key,side,sensor,value
        // 0,0,0,0,0,2,102
        dispatch(setKeySensor(values))
        // console.log('>> K-Board Pro 4: sensor value', values);
        if(override) {
          console.log('>> K-Board Pro 4: sensor override', values);
          dispatch(setOverrideSensor(gangBank,sensorValues.join(','),0));
        }

        if(sensorCount === SENSORS * BANKS && sensorKeyCount === KEY_SENSORS) {
          console.log('>> K-Board Pro 4: Sensors Ready!');
          dispatch({ type: SENSORS_LOADED, loaded: true })
          window.KBoardPro4.removeListener('sensordata')
          window.KBoardPro4.removeListener('sensorkeydata')
        }
      })

      window.KBoardPro4.getSensorBank(0)
      setTimeout(() => window.KBoardPro4.getSensorBank(1), 3000)
    }

    dispatch({ type: DEVICE_REQUEST_SENSOR_BANK })
  }
};
// special case for key on-threshold
export const sendAuditionSensor = (gangBank, sensorData, editMode) => {
  // MEM_LOC_AUDITION, USER_MEM_BANK_0, USER_MEM_BANK_GANG_2, octave, key_num, side, sense_num, sensor_value
  // 0                 0                0
  // convert sensorData to param string and append to gangBank
  const octaveIndexes = [0,1,2,3], keyIndexes = [0,1,2,3,4,5,6,7,8,9,10,11], sideIndexes = [0,1], sensorIndexes = [0,1,2,3,4,5]
  const mode = 0, [gangType,] = gangBank.split('|').map(Number), [octave,key,side,,sensorValue] = sensorData.split(',').map(Number)

  let auditionSensors = []

  switch (Number(editMode)) {
    case 0: // single sensor
        auditionSensors.push([mode,gangBank,sensorData].join(','))
      break;
    case 1: // entire key
      sideIndexes.forEach(sideIndex => {
        sensorIndexes.forEach(sensorIndex => {
          auditionSensors.push([mode,gangBank,octave,key,sideIndex,sensorIndex,sensorValue].join(','))
        })
      })
      break;
    case 2: // entire octave
      if(gangType === 1) {
        keyIndexes.forEach(keyIndex => auditionSensors.push([mode,gangBank,octave,keyIndex,side,0,sensorValue].join(',')))
      } else {
        keyIndexes.forEach(keyIndex => {
          sideIndexes.forEach(sideIndex => {
            sensorIndexes.forEach(sensorIndex => {
              auditionSensors.push([mode,gangBank,octave,keyIndex,sideIndex,sensorIndex,sensorValue].join(','))
            })
          })
        })
      }
      break;
    case 3: // entire device
      if(gangType === 1) {
        octaveIndexes.forEach(octaveIndex => {
          keyIndexes.forEach(keyIndex => auditionSensors.push([mode,gangBank,octaveIndex,keyIndex,side,0,sensorValue].join(',')))
        })
      } else {
        octaveIndexes.forEach(octaveIndex => {
          keyIndexes.forEach(keyIndex => {
            sideIndexes.forEach(sideIndex => {
              sensorIndexes.forEach(sensorIndex => {
                auditionSensors.push([mode,gangBank,octaveIndex,keyIndex,sideIndex,sensorIndex,sensorValue].join(','))
              })
            })
          })
        })
      }
      break;
    default:

  }

  return (dispatch) => {
    dispatch({ type: DEVICE_AUDITION_SENSOR, editMode: editMode })

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      auditionSensors.forEach(sensorParam => {
        console.log('>> K-Board Pro 4: audition sensor', sensorParam);
        window.KBoardPro4.setSensor(sensorParam)
      })

    }
  }
}

export const sendWriteSensor = (gangBank, sensorData, editMode) => {
  // MEM_LOC_AUDITION, USER_MEM_BANK_0, USER_MEM_BANK_GANG_2, octave, key_num, side, sense_num, sensor_value
  // 1                 0                0
  // convert sensorData to param string and append to gangBank
  const mode = 1, writeParams = [mode,gangBank,sensorData].join(',')

  return (dispatch) => {
    dispatch({ type: DEVICE_WRITE_SENSOR })

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      window.KBoardPro4.setSensor(writeParams)
    }
  }
}

export const sendEraseSensorBank = (bankIndex) => {
  return (dispatch) => {
    dispatch({ type: DEVICE_ERASE_SENSOR_BANK })

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      window.KBoardPro4.eraseSensorBank(bankIndex)
    }
  }
}

export const sendRecalculateSensorData = () => {
  return (dispatch) => {
    dispatch({ type: DEVICE_RECALCULATE_SENSORS })

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      window.KBoardPro4.recalculateSensorData()
    }
  }
}

export const sendWriteSensorBanks = () => {
  return (dispatch, getState) => {
    // send erase bank messages
    dispatch(sendEraseSensorBank(0))
    dispatch(sendEraseSensorBank(1))

    dispatch({ type: DEVICE_WRITE_SENSOR_BANK })

    Object.entries(getState().keySensors.overrides).forEach((sensor) => {
      const [gangType, bankIndex, ...sensorData] = sensor.join(',').split(',')
      console.log('>> sensor:write overrides', `${gangType}|${bankIndex}`,`${sensorData}`);
      dispatch(sendWriteSensor(`${gangType}|${bankIndex}`,`${sensorData}`))
    })
  }
}

// Solo Mode
export const sendSoloMessage = () => {
  return (dispatch, getState) => {
    const selectedZone = getState().editor.selectedZone,
          soloMessageType = getState().editor.soloMessageType,
          soloMessageChannel = getState().editor.soloMessageChannel - 1

    const statusByte = soloMessageType < 3 ? getState().currentPreset.keys[soloMessageType].mode[selectedZone] : 144

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      if(soloMessageType === 3) {
        dispatch({ type: SEND_SOLO_MESSAGE, message: `${statusByte + soloMessageChannel},${60},${127}` })
        window.KBoardPro4.sendSolo(`${statusByte + soloMessageChannel},${60},${127}`)
         // send noteOff
        setTimeout(() => window.KBoardPro4.sendSolo(`${128 + soloMessageChannel},${60},${127}`), 1000)
      } else {
        let CC = midiMessageTypesTable[statusByte] === 176 ? getState().currentPreset.keys[soloMessageType].cc[selectedZone] : undefined

        dispatch({ type: SEND_SOLO_MESSAGE, message: `${midiMessageTypesTable[statusByte] + soloMessageChannel},${CC ? CC : 64},${127}` })
        window.KBoardPro4.sendSolo(`${midiMessageTypesTable[statusByte] + soloMessageChannel},${CC ? CC : 64},${127}`)
      }
    }
  }
}

// Firmware
export const setBootloaderMode = (active) => {
  return {
    type: SET_BOOTLOADER_MODE,
    active: active
  }
};

export const requestFirmwareVersion = () => {
  return (dispatch, getState) => {
    dispatch({ type: DEVICE_REQUEST_FIRMWARE_VERSIONS })

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      window.KBoardPro4.once('firmwareversion', (versions) => {
        const { firmware: firmwareVersion, bootloader } = deviceVersions(versions),
              compatibleFirmwareVersion = getState().editor.minimumCompatibleVersion

        console.log(`>> K-Board Pro 4: firmware ${firmwareVersion} bootloader ${bootloader}`);
        // only request presets if the device has the minimumCompatibleVersion
        if(compareVersions(compatibleFirmwareVersion, firmwareVersion) < 1) {
          getDevicePresets(dispatch, getState)
        } else {
          console.warn(`>> K-Board Pro 4 Editor: incompatible firmware v.${firmwareVersion} on your K-Board Pro 4`);
          alert(`Firmware v.${firmwareVersion} is incompatible with this Editor.\nPlease update to v.${compatibleFirmwareVersion}`)
        }
        if(window.showFullVersions) console.log('K-Board Pro 4:', versions);
        dispatch(setFirmwareVersion(deviceVersions(versions)))
        dispatch(setUpdateableFirmware(getState().device.availableFirmware.version, firmwareVersion))
      })

      window.KBoardPro4.getFirmwareVersion()
    }
  }
};

export const setUpdateableFirmware = (availableFirmwareVersion, deviceFirmwareVersion) => {
  return (dispatch, getState) => {
    const editorUpdateAvailable = getState().editor.editorUpdateAvailable
    const firmwareUpdateAvailable = compareVersions(availableFirmwareVersion, deviceFirmwareVersion)

    // check if editor and fw available
    if (firmwareUpdateAvailable && editorUpdateAvailable) {
      dispatch(setUpdatesAvailable())
    } else if (firmwareUpdateAvailable > 0) {
      setTimeout(() => {
        dispatch(setStatusMessage('firmware update available'))
      }, 1000)
      setTimeout(() => {
        dispatch(setStatusMessage(getState().device.connected ? 'connected' : 'disconnected'))
      }, 15000)
    } else if (editorUpdateAvailable > 0) {
      setTimeout(() => {
        dispatch(setStatusMessage('editor update available'))
      }, 1000)
      setTimeout(() => {
        dispatch(setStatusMessage(getState().device.connected ? 'connected' : 'disconnected'))
      }, 15000)
    }

    dispatch({
      type: SET_FIRMWARE_UPDATE_AVAILABLE,
      updateable: firmwareUpdateAvailable
    })
  }
}

export const setFirmwareVersion = (versions) => {
  return {
    type: SET_FIRMWARE_VERSION,
    versions: versions
  }
};

// request presets only if fw version is compatible
function getDevicePresets(dispatch, getState) {
  dispatch(resetDevicePresetStore())
  dispatch(requestPreset('1'))
  dispatch(requestPreset('2'))
  dispatch(requestPreset('3'))
  dispatch(requestPreset('4'))
  setTimeout(() => {
    if(getState().presets.device.length){
      dispatch({ type: SELECT_PRESET, selectedPreset: 'device-0' })
      dispatch({ type: SET_CURRENT_PRESET, preset: getState().presets.device[0] })
    }
  }, 500)
}

// Firmware update - blocked because we're in a plain browser (no Electron
// main process to shell out to sendsysex) on Windows. WebMIDI can't do the
// raw-transport sub-splitting a K-Board Pro 4 firmware flash requires there
// (see firmware/kbp4-firmware-update-process.md) - sending it as a single
// monolithic sysex, the only thing WebMIDI's send() can express, fails on
// Windows. macOS/Linux browsers are unaffected and keep the normal flow.
export const firmwareUpdateUnsupportedPlatform = () => {
  return (dispatch) => {
    console.log('>> K-Board Pro 4: firmware update blocked — browser on Windows can\'t drive this safely, desktop editor required');
    dispatch({ type: FIRMWARE_UPDATE_UNSUPPORTED_PLATFORM })
  }
};

// Firmware update - Windows desktop editor only. Delegates to the bundled
// sendsysex binary (shelled out from the Electron main process - see
// apps/desktop/firmwareUpdate.js) instead of WebMIDI, which can't safely
// drive this device's update on Windows (see the unsupported-platform guard
// above, and firmware/kbp4-firmware-update-process.md for the full why). The
// main process opens its own log window and reports back over
// 'firmware-update-sendsysex-done' (wired in Preferences.js), which reuses
// the normal firmwareUpdateComplete/firmwareUpdateError actions.
export const firmwareUpdateViaSendSysEx = () => {
  return (dispatch) => {
    console.log('>> K-Board Pro 4: firmware update — delegating to bundled SendSysEx (Windows desktop)');
    if(window.ipcRenderer && typeof window.ipcRenderer.send === 'function') {
      window.ipcRenderer.send('firmware-update-sendsysex')
    }
  }
};

export const fetchFirmware = (url) => {
  return (dispatch, getState) => {
    if(isWindows() && !isElectron()) {
      dispatch(firmwareUpdateUnsupportedPlatform())
      return false
    }

    if(isElectron() && isWindows()) {
      dispatch(firmwareUpdateViaSendSysEx())
      return false
    }

    if(url === null) {
      console.log('>> K-Board Pro 4: could not fetch firmware due to a network issue');
      // disable FW button
      // set message
      // dispatch things
      return false
    }

    let networkConnection = navigator.onLine

    dispatch({type: DEVICE_UPDATE_FIRMWARE})
    dispatch({type: FETCH_FIRMWARE})
    if(window.KBoardPro4.connection.bootloader.initial) dispatch(deviceConnection('updatingfirmware'))

    Promise.all([
      (isElectron() && !networkConnection) ? getBuffer(internalFirmwareCentralPath) : asyncFetchBuffer(paths.base+url.central),
      (isElectron() && !networkConnection) ? getBuffer(internalFirmwarePeripheralPath) : asyncFetchBuffer(paths.base+url.peripheral)
    ])
    .then(firmwareBuffers => {
      if(firmwareBuffers.some(v => v === false)) {
        // send message or status
        console.log('>> K-Board Pro 4: could not update firmware due to a network issue');
        return false;
      }
      console.log('>> K-Board Pro 4: firmware files downloaded, entering bootloader');
      if(window.KBoardPro4 && (window.KBoardPro4.isConnected() || window.KBoardPro4.connection.bootloader.connected)){
        window.KBoardPro4.once('bootloaderready', () => {
          dispatch({type:BOOTLOADER_READY})
          dispatch({type:SEND_FIRMWARE_CENTRAL})

          setTimeout(() => {
            console.log('>> K-Board Pro 4: bootloader ready, sending central firmware');
            window.KBoardPro4.bootloader.send(new Uint8Array(firmwareBuffers[0]))
          }, 0)
        })
        window.KBoardPro4.once('updateperipheralboards', () => {
          dispatch({type:BOOTLOADER_DISCONNECT})
          dispatch({type:PERIPHERAL_READY})
          dispatch({type:SEND_FIRMWARE_PERIPHERAL})

          setTimeout(() => {
            console.log('>> K-Board Pro 4: peripheral ready, sending peripheral firmware');
            window.KBoardPro4.send(new Uint8Array(firmwareBuffers[1]))
          }, 5000)
        })

        window.KBoardPro4.enterBootloader()
        dispatch({type:DEVICE_ENTER_BOOTLOADER})
      }
    })
    .catch(err => console.log('>> K-Board Pro 4 Editor: firmware download failed', err))
  }
};

// after FW update, request firmware version
export const firmwareUpdateComplete = () => {
  return (dispatch) => {
    setTimeout(() => {
      console.log('>> K-Board Pro 4: Firmware Update Complete!');
      dispatch({type: FIRMWARE_UPDATE_COMPLETE})
      dispatch({ type: CONNECT })
      dispatch(setStatusMessage('firmware update complete!'))
      dispatch(setBootloaderMode(false))

      dispatch(requestFirmwareVersion())
    }, 3000)

    setTimeout(() => dispatch(setStatusMessage('connected')), 8000)

    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) {
      window.KBoardPro4.sendFWUStatus('success')
    }
  }
};

// Firmware update - per-board peripheral progress (drives the 51-100% range)
export const firmwarePeripheralProgress = (boardsUpdated) => ({
  type: FIRMWARE_PERIPHERAL_PROGRESS,
  boardsUpdated
});

// Firmware update - failed/timed out (e.g. an octave MCU did not respond)
export const firmwareUpdateError = (message) => {
  return (dispatch) => {
    console.log('>> K-Board Pro 4: firmware update failed —', message);
    // release the js-api firmware guard so the editor resumes normal operation
    if(window.KBoardPro4) {
      window.KBoardPro4.updatingFirmware = false
      window.KBoardPro4.updatedBoards = 0
    }
    dispatch({ type: FIRMWARE_UPDATE_ERROR, message })
    dispatch(setBootloaderMode(false))
    dispatch(setStatusMessage('firmware update failed'))
  }
};

// Firmware update - dismiss the progress/error popup
export const firmwareUpdateDismiss = () => {
  return (dispatch) => {
    if(window.KBoardPro4) {
      window.KBoardPro4.updatingFirmware = false
      window.KBoardPro4.updatedBoards = 0
    }
    dispatch({ type: FIRMWARE_UPDATE_DISMISS })
  }
};

// Device - reset
export const resetDevice = () => {
  return (dispatch, getState) => {
    dispatch({type: DEVICE_RESET})
    if(window.KBoardPro4 && window.KBoardPro4.isConnected()) window.KBoardPro4.reset()
    setTimeout(() => {
      dispatch(setRevertablePreset(false))
      dispatch(resetDevicePresetStore())
      dispatch(resetUserCurveStore())
      dispatch(requestPreset('1'))
      dispatch(requestPreset('2'))
      dispatch(requestPreset('3'))
      dispatch(requestPreset('4'))
      setTimeout(() => {
        dispatch({ type: SELECT_PRESET, selectedPreset: 'device-0' })
        dispatch({ type: SET_CURRENT_PRESET, preset: getState().presets.device[0] })
      }, 500)
    }, 1000)
  }
}
