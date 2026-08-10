// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  ONLINE,
  OFFLINE,
  SET_STATUS_MESSAGE,
  TOGGLE_PRESET_DIALOG,
  SELECT_ZONE,
  SELECT_KEY,
  REVERTABLE_PRESET,
  RESET_DEVICE_PRESETS_IN_STATE,
  DEVICE_PRESETS_LOADED,
  OPEN_PREFERENCES,
  OPEN_PRESET_RENAMER,
  CLOSE_PRESET_RENAMER,
  SET_TEMP_IMPORTED_PRESETS,
  SET_IMPORTED_PRESET_NAME,
  SET_IMPORTED_PRESET_NAMES,
  RESET_IMPORTED_NAMES,
  SET_AVAILABLE_EDITOR,
  SET_EDITOR_UPDATE_AVAILABLE,
  SET_AVAILABLE_FIRMWARE,
  SET_UPDATES_AVAILABLE,
  SET_VISUALZER_STATE,
  EDITOR_UPDATING,
  EDITOR_DOWNLOAD_PROGRESS,
  SET_REVERTABLE_CURVE,
  SET_SENSOR_MODE,
  SET_SOLO_MESSAGE_TYPE,
  SET_SOLO_MESSAGE_CHANNEL,
  SET_CURVE_EDITOR_OPENER,
  SET_MIDI_THRU,
  REFRESH_THRU_PORTS
} from './actionTypes'

import {
  getPresetFromID
} from '../utilities'

import {
  setCurrentPreset,
  setOctaveZoned,
  setTransposeZoned,
  setPitchBendMemberRangeZoned,
  setPitchBendReturnModeZoned,
  setPitchBendReturnTimeZoned,
  setSliderMode
} from './'

export const networkStatus = () => {
  return (dispatch) => dispatch(navigator.onLine ? {type: ONLINE} : {type: OFFLINE})
}

export const setAvailableFirmware = (version) => ({ type: SET_AVAILABLE_FIRMWARE, version: version });

export const setAvailableEditor = (version) => ({ type: SET_AVAILABLE_EDITOR, version: version });
export const setUpdateableEditor = (updateable) => {
  return (dispatch) => {
    dispatch({ type: SET_EDITOR_UPDATE_AVAILABLE, updateable: updateable })
  }
};

export const setUpdatesAvailable = () => {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(setStatusMessage('firmware and editor updates available'))
    }, 1000)
    setTimeout(() => {
      dispatch(setStatusMessage(getState().device.connected ? 'connected' : 'disconnected'))
    }, 15000)
    dispatch({ type: SET_UPDATES_AVAILABLE })
  }
}

export const setStatusMessage = (message) => ({ type: SET_STATUS_MESSAGE, message: message });

export const setRevertablePreset = (length) => ({ type: REVERTABLE_PRESET, diffLength: length });
export const resetDevicePresetStore = () => ({ type: RESET_DEVICE_PRESETS_IN_STATE });

export const selectZone = (zone) => ({ type: SELECT_ZONE, zone: zone });

export const selectKey = (key) => ({ type: SELECT_KEY, key: key });

export const devicePresetsLoaded = (status) => ({ type: DEVICE_PRESETS_LOADED, status: status });

export const togglePresetDialog = () => ({ type: TOGGLE_PRESET_DIALOG });
export const openPreferences = (open) => {
  return (dispatch) => {
    dispatch({ type: OPEN_PREFERENCES, open: open })
  }
};

export const openPresetRenamer = () => ({ type: OPEN_PRESET_RENAMER });
export const closePresetRenamer = () => ({ type: CLOSE_PRESET_RENAMER });
export const setTempImportedPresets = (presets, duplicates) => {
  return {
    type: SET_TEMP_IMPORTED_PRESETS,
    presets: presets,
    duplicates: duplicates
  }
}
export const setImportedName = (index, name) => {
  return {
    type: SET_IMPORTED_PRESET_NAME,
    index: index,
    name: name
  }
}
export const setImportedNames = (names, updated) => {
  return {
    type: SET_IMPORTED_PRESET_NAMES,
    updated: updated,
    names: names
  }
}
export const resetImportedNames = () => {
  return {type: RESET_IMPORTED_NAMES}
}

export const setVisualizerState = (active) => {
  return {type: SET_VISUALZER_STATE, active: active}
}

export const setEditorUpdatingStatus = () => {
  return {type: EDITOR_UPDATING, updating: true}
}

export const setDownloadProgress = (percent) => {
  return {type: EDITOR_DOWNLOAD_PROGRESS, percent: percent * 100}
}

export const setRevertableCurve = (revertable) => {
  return {type: SET_REVERTABLE_CURVE, revertable: revertable}
}

export const setSensorEditMode = (mode) => {
  return {type: SET_SENSOR_MODE, mode: mode}
}

export const setSoloMessageType = (messageType) => {
  return {type: SET_SOLO_MESSAGE_TYPE, messageType: messageType}
}

export const setSoloMessageChannel = (channel) => {
  return {type: SET_SOLO_MESSAGE_CHANNEL, channel: channel}
}

export const setCurveEditorOpener = (index) => {
  return {type: SET_CURVE_EDITOR_OPENER, index: index}
}

export const setMIDIThruPort = (name) => {
  window.kbp4thru = null
  return { type: SET_MIDI_THRU, portname: name }
}

export const refreshThruPorts = (name) => {
  window.kbp4thru = null

  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: REFRESH_THRU_PORTS })
      dispatch({ type: SET_MIDI_THRU, portname: '' })
      setTimeout(() => dispatch({ type: SET_MIDI_THRU, portname: 'none' }), 250)
    }, 750)
  }
}

export const selectUI = (control, presets) => {
  const { ui, value, zone } = control
  return (dispatch) => {
    switch (ui) {
      case 'active_preset':
        const preset = getPresetFromID(presets, 'device-'+value)
        dispatch(setCurrentPreset(preset, 'device-'+value))
        break;
      case 'pitch_bend_range':
        dispatch(setPitchBendMemberRangeZoned(zone, value))
        break;
      case 'octave':
        dispatch(setOctaveZoned(zone, value))
        break;
      case 'transpose':
        dispatch(setTransposeZoned(zone, value))
        break;
      case 'return_mode':
        dispatch(setPitchBendReturnModeZoned(zone, value))
        break;
      case 'return_time':
        dispatch(setPitchBendReturnTimeZoned(zone, value))
        break;
      case 'slider_mode':
        // zone === slider index
        // value === slider mode
        dispatch(setSliderMode(zone, value))
        break;
      default:
    }
  }
};
