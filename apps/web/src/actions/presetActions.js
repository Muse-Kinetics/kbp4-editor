// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import compareVersions from 'compare-versions'

import {
  INITIAL_PRESET_LOADED,
  SET_CURRENT_PRESET,
  UPDATE_CURRENT_PRESET_NAME,
  SAVE_PRESET,
  ADD_PRESET,
  SAVE_NEW_PRESET,
  CANCEL_SAVE_AS_PRESET,
  DELETE_PRESET,
  REVERT_PRESET,
  SELECT_PRESET,
  SELECT_PRESET_DESTINATION,
  SET_USER_PRESET_NAME,
  DOWNLOAD_USER_PRESETS,
  SELECT_ZONE
} from './actionTypes'

import { exportLocalStorage, getNextPreset } from '../utilities'

import {
  togglePresetDialog,
  setRevertablePreset,
  setStatusMessage
} from './editorActions'

import {
  sendPreset,
  loadPreset,
  updatePresetName,
  requestUserCurve
} from './deviceActions'

export const selectPreset = (presetID) => ({ type: SELECT_PRESET, selectedPreset: presetID });
export const selectPresetDetination = (destination) => ({ type: SELECT_PRESET_DESTINATION, destination: destination });

export const deletePreset = (name, presets) => {
  const { nextSelectPresetID, nextPreset } = getNextPreset(name, presets)

  return (dispatch) => {
    dispatch({ type: DELETE_PRESET, name: name })
    dispatch({ type: SET_CURRENT_PRESET, preset: nextPreset })
    dispatch({ type: SELECT_PRESET, selectedPreset: nextSelectPresetID })
    dispatch(setRevertablePreset(false))
    dispatch(nextSelectPresetID.includes('device') ? loadPreset(Number(nextSelectPresetID.split('-')[1]) + 1) : sendPreset(nextPreset))
  }
};

export const setCurrentPreset = (preset, id) => {
  return (dispatch, getState) => {
    if(compareVersions(preset.preset_version.join('.'), getState().device.minimumCompatibleFirmwareVersion) < 0){
      dispatch(setStatusMessage("incompatible preset"))
      setTimeout(() => dispatch(setStatusMessage(getState().device.connected ? "connected" : "disconnected")), 5000)
    } else {
      dispatch({ type: SET_CURRENT_PRESET, preset: preset })
      dispatch({ type: SELECT_PRESET, selectedPreset: id })
      dispatch(id.includes('device') ? loadPreset(Number(id.split('-')[1]) + 1) : sendPreset(preset))
      dispatch(setRevertablePreset(false))
      dispatch({ type: SELECT_ZONE, zone: preset.zone_split_key_num === 0 ? 1 : 0 })
    }
  }
};

export const updateCurrentPresetName = (presetName) => {
  return (dispatch) => dispatch({ type: UPDATE_CURRENT_PRESET_NAME, name: presetName })
};

export const initialPresetLoad = (preset, id) => {
  console.log(`>> K-Board Pro 4: initial preset loaded: ${id} --> ${preset.name}`);
  return (dispatch) => {
    dispatch({ type: INITIAL_PRESET_LOADED })
    dispatch(setCurrentPreset(preset, id))
    dispatch(requestUserCurve('0'))
    setTimeout(() => dispatch(requestUserCurve('1')), 100)
    setTimeout(() => dispatch(requestUserCurve('2')), 200)
    setTimeout(() => dispatch(requestUserCurve('3')), 300)
  }
}

export const revertPreset = (preset) => {
  return (dispatch, getState) => {
    const selectedPreset = getState().editor.selectedPreset
    // get selectedZone from origin preset based off of splitKey
    dispatch({ type: SET_CURRENT_PRESET, preset: preset })
    dispatch(selectedPreset.includes('device') ? loadPreset(Number(selectedPreset.split('-')[1]) + 1) : sendPreset(preset))
    dispatch(setRevertablePreset(false))
    dispatch({ type: REVERT_PRESET })
    dispatch({ type: SELECT_ZONE, zone: 0 })
  }
}

export const addPreset = (category, preset) => ({ type: ADD_PRESET, category: category, preset: preset });

export const savePresetToStorage = (preset, id) => {
  return (dispatch) => {
    dispatch({ type: SAVE_PRESET, preset: preset, id: id})
    dispatch(setRevertablePreset(false))
  }
};

export const saveNewPreset = (preset, name) => {
  return (dispatch, getState) => {
    dispatch(togglePresetDialog())
    dispatch({ type: SAVE_NEW_PRESET, category: 'user', preset: preset, name: name })
    // update preset name in edit buffer
    dispatch(updatePresetName(name))
        // select newly saved preset / update name in current preset
    dispatch({ type: SET_CURRENT_PRESET, preset: Object.assign(preset, {name: name}) })
    // select new preset in menu
    dispatch({ type: SELECT_PRESET, selectedPreset: `user-${getState().presets.user.length - 1}` })
    dispatch(setRevertablePreset(false))
    dispatch({ type: REVERT_PRESET })
  }
};
export const setUserPresetName = (presetName) => ({ type: SET_USER_PRESET_NAME, name: presetName });
export const cancelSaveAsPreset = () => ({ type: CANCEL_SAVE_AS_PRESET });

export const downloadUserPresets = () => {
  exportLocalStorage()
  return {type: DOWNLOAD_USER_PRESETS}
}
