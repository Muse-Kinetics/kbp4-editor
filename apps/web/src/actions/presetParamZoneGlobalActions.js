// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SET_MIDI_DEVICE_CHANNEL,
  SET_MPE_DEVICE_CHANNEL,

  SET_RELEASE_VELOCITY_ON,
  SET_NOTE_ON_CURVE_INDEX,
  SET_RELEASE_VELOCITY_CURVE_INDEX,

  SET_PITCH_BEND_MASTER_RANGE,
  SET_PITCH_BEND_MEMBER_RANGE,
  SET_PITCH_BEND_RETURN_MODE,
  SET_PITCH_BEND_RETURN_TIME,
  SET_PITCH_BEND_RETURN_CURVE,

  SET_TRANSPOSE,
  SET_OCTAVE
} from './actionTypes'

export const setMIDIDeviceChannel = (channel) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_MIDI_DEVICE_CHANNEL,
      channel: channel,
      zone: zone
    })
  }
};
export const setMPEDeviceChannel = (channel) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_MPE_DEVICE_CHANNEL,
      channel: channel,
      zone: zone
    })
  }
};
export const setNoteOffVelocityOn = (on) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_RELEASE_VELOCITY_ON,
      on: on,
      zone: zone
    })
  }
};
export const setNoteOnVelocityCurve = (index) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_NOTE_ON_CURVE_INDEX,
      index: index,
      zone: zone
    })
  }
};
export const setReleaseVelocityCurve = (index) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_RELEASE_VELOCITY_CURVE_INDEX,
      index: index,
      zone: zone
    })
  }
};

export const setPitchBendMasterRange = (range) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_PITCH_BEND_MASTER_RANGE,
      zone: zone,
      range: range
    })
  }
};
export const setPitchBendMemberRange = (range) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_PITCH_BEND_MEMBER_RANGE,
      zone: zone,
      range: range
    })
  }
};
export const setPitchBendMemberRangeZoned = (zone, range) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PITCH_BEND_MEMBER_RANGE,
      zone: zone,
      range: range
    })
  }
};
export const setPitchBendReturnMode = (mode) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_PITCH_BEND_RETURN_MODE,
      zone: zone,
      mode: mode
    })
  }
};
export const setPitchBendReturnModeZoned = (zone, mode) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PITCH_BEND_RETURN_MODE,
      zone: zone,
      mode: mode
    })
  }
};
export const setPitchBendReturnTime = (time) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_PITCH_BEND_RETURN_TIME,
      zone: zone,
      time: time
    })
  }
};
export const setPitchBendReturnTimeZoned = (zone, time) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PITCH_BEND_RETURN_TIME,
      zone: zone,
      time: time * 0.1 // 0 - 1.1
    })
  }
};
export const setPitchBendReturnCurve = (index) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_PITCH_BEND_RETURN_CURVE,
      zone: zone,
      index: index
    })
  }
};

export const setOctave = (octave) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_OCTAVE,
      octave: octave,
      zone: zone
    })
  }
};
export const setOctaveZoned = (zone, octave) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_OCTAVE,
      octave: octave,
      zone: zone
    })
  }
};
export const setTranspose = (transpose) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_TRANSPOSE,
      transpose: transpose,
      zone: zone
    })
  }
};
export const setTransposeZoned = (zone, transpose) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSPOSE,
      transpose: transpose,
      zone: zone
    })
  }
};
