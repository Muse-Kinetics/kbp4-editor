// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SET_PRESET_VERSION,
  SET_MPE_MODE,
  SET_MPE_DEVICE_CHANNEL,
  SET_MIDI_DEVICE_CHANNEL,
  SET_ZONE_SPLIT_KEY,
  SET_DEVICE_SENSITIVITY,
  SELECT_ZONE
} from './actionTypes'

export const setPresetVersion = (version) => ({ type: SET_PRESET_VERSION, version: version });

export const setMPEMode = (mode) => ({ type: SET_MPE_MODE, mode: mode });

export const setZoneSplitKey = (key) => {
  return (dispatch, getState) => {
    const mpeMode = getState().currentPreset.mpe_mode

    // set split key
    dispatch({ type: SET_ZONE_SPLIT_KEY, key: key })

    // auto set zone channels & active zone
    if(mpeMode){
      if(key === 0) { // upper zone
        dispatch({ type: SELECT_ZONE, zone: 0 })
        dispatch({ type: SET_MPE_DEVICE_CHANNEL, zone: 0, channel: 0 })
        dispatch({ type: SELECT_ZONE, zone: 1 })
        dispatch({ type: SET_MPE_DEVICE_CHANNEL, zone: 1, channel: 15 })
      } else if (key === 48) { // lower zone
        dispatch({ type: SELECT_ZONE, zone: 1 })
        dispatch({ type: SET_MPE_DEVICE_CHANNEL, zone: 1, channel: 0 })
        dispatch({ type: SELECT_ZONE, zone: 0 })
        dispatch({ type: SET_MPE_DEVICE_CHANNEL, zone: 0, channel: 15 })
      } else {
        dispatch({ type: SELECT_ZONE, zone: 0 })
        dispatch({ type: SET_MPE_DEVICE_CHANNEL, zone: 0, channel: 7 })
        // auto select zone 1 when zone splitting
        dispatch({ type: SELECT_ZONE, zone: 1 })
        dispatch({ type: SET_MPE_DEVICE_CHANNEL, zone: 1, channel: 7 })
      }
    } else {
      if(key === 0) { // upper zone
        dispatch({ type: SELECT_ZONE, zone: 0 })
        dispatch({ type: SET_MIDI_DEVICE_CHANNEL, zone: 0, channel: 0 })
        dispatch({ type: SELECT_ZONE, zone: 1 })
        dispatch({ type: SET_MIDI_DEVICE_CHANNEL, zone: 1, channel: 15 })
      } else if (key === 48) { // lower zone
        dispatch({ type: SELECT_ZONE, zone: 1 })
        dispatch({ type: SET_MIDI_DEVICE_CHANNEL, zone: 1, channel: 0 })
        dispatch({ type: SELECT_ZONE, zone: 0 })
        dispatch({ type: SET_MIDI_DEVICE_CHANNEL, zone: 0, channel: 15 })
      } else {
        dispatch({ type: SELECT_ZONE, zone: 0 })
        dispatch({ type: SET_MIDI_DEVICE_CHANNEL, zone: 0, channel: 0 })
        // auto select zone 1 when zone splitting
        dispatch({ type: SELECT_ZONE, zone: 1 })
        dispatch({ type: SET_MIDI_DEVICE_CHANNEL, zone: 1, channel: 15 })
      }
    }
  }
};

export const setDeviceSensitivity = (sensitivity) => ({ type: SET_DEVICE_SENSITIVITY, sensitivity: sensitivity });
