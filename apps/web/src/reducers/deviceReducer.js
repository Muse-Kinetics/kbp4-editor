// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import initialState from './initialState'

import {
  CONNECT,
  DISCONNECT,
  RECONNECT,
  SET_AVAILABLE_FIRMWARE,
  SET_FIRMWARE_VERSION,
  SET_FIRMWARE_UPDATE_AVAILABLE,
  DEVICE_UPDATE_FIRMWARE,
  UPDATE_FIRMWARE,
  SEND_FIRMWARE_PERIPHERAL,
  FIRMWARE_PERIPHERAL_PROGRESS,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_DISMISS,
  SET_BOOTLOADER_MODE
} from '../actions/actionTypes'

export default function deviceReducer(state = initialState.device, action) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        connected: true
      }
    case DISCONNECT:
      return {
        ...state,
        connected: false
      }
    case RECONNECT:
      return {
        ...state,
        connected: true
      }
    case SET_AVAILABLE_FIRMWARE:
      return {
        ...state,
        availableFirmware: action.version
      }
    case SET_FIRMWARE_VERSION:
      return {
        ...state,
        firmwareVersion: action.versions.firmware,
        bootloaderVersion: action.versions.bootloader
      }
    case SET_FIRMWARE_UPDATE_AVAILABLE:
      return {
        ...state,
        firmwareUpdateAvailable: action.updateable > 0
      }
    case DEVICE_UPDATE_FIRMWARE:
      return {
        ...state,
        updatingFirmware: true,
        firmwareStage: 'central',
        firmwareBoardsUpdated: 0,
        firmwareError: null
      }
    case UPDATE_FIRMWARE:
      return {
        ...state,
        updatingFirmware: true
      }
    case SEND_FIRMWARE_PERIPHERAL:
      return {
        ...state,
        firmwareStage: 'peripheral'
      }
    case FIRMWARE_PERIPHERAL_PROGRESS:
      return {
        ...state,
        firmwareStage: 'peripheral',
        firmwareBoardsUpdated: action.boardsUpdated
      }
    case FIRMWARE_UPDATE_COMPLETE:
      return {
        ...state,
        updatingFirmware: false,
        firmwareStage: 'complete',
        firmwareBoardsUpdated: state.firmwareBoardsExpected,
        firmwareError: null
      }
    case FIRMWARE_UPDATE_ERROR:
      return {
        ...state,
        updatingFirmware: false,
        firmwareStage: 'error',
        firmwareError: action.message
      }
    case FIRMWARE_UPDATE_DISMISS:
      return {
        ...state,
        updatingFirmware: false,
        firmwareStage: 'idle',
        firmwareBoardsUpdated: 0,
        firmwareError: null
      }
    case SET_BOOTLOADER_MODE:
      return {
        ...state,
        bootloaderMode: action.active
      }

    default:
      return state
  }
}
