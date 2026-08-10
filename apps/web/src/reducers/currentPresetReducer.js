// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// https://github.com/debitoor/dot-prop-immutable
import initialState from './initialState'

import {
  SET_CURRENT_PRESET,
  UPDATE_CURRENT_PRESET_NAME,
  SET_MPE_MODE,
  SET_ZONE_SPLIT_KEY,
  SET_DEVICE_SENSITIVITY,
  SET_MIDI_DEVICE_CHANNEL,
  SET_MPE_DEVICE_CHANNEL,
  SET_KEY_AXIS_MODE, SET_KEY_AXIS_THRESHOLD, SET_KEY_AXIS_GAIN, SET_KEY_AXIS_CC, SET_KEY_AXIS_OFFSET, SET_KEY_AXIS_RELATIVE_START, SET_KEY_AXIS_CURVE, SET_KEY_AXIS_ZERO_ON_RELEASE,
  SET_SLIDER_MODE, SET_SLIDER_CC, SET_SLIDER_ZONE, SET_SLIDER_SENSITIVITY, SET_LED_MODE,
  SET_ZONE_CURVE,
  SET_PEDAL_MODE, SET_PEDAL_CC,SET_PEDAL_THRESHOLD, SET_PEDAL_ZONE,
  SET_PITCH_BEND_MASTER_RANGE,
  SET_PITCH_BEND_MEMBER_RANGE,
  SET_PITCH_BEND_RETURN_MODE,
  SET_PITCH_BEND_RETURN_TIME,
  SET_PITCH_BEND_RETURN_CURVE,
  SET_OCTAVE,
  SET_TRANSPOSE,
  SET_RELEASE_VELOCITY_ON,
  SET_KEY_AXIS_INVERT,
  SET_NOTE_ON_CURVE_INDEX,
  SET_RELEASE_VELOCITY_CURVE_INDEX
 } from '../actions/actionTypes'

export default function currentPresetReducer(state = initialState.currentPreset, action) {
  switch (action.type) {
    case SET_CURRENT_PRESET:
      return { ...action.preset }
    // update name
    case UPDATE_CURRENT_PRESET_NAME:
      return {
        ...state,
        name: action.name
      }
    // keys
    case SET_KEY_AXIS_MODE: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          mode: [
            ...state.keys[action.axis].mode.slice(0, action.zone),
            action.mode,
            ...state.keys[action.axis].mode.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_THRESHOLD: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          threshold: [
            ...state.keys[action.axis].threshold.slice(0, action.zone),
            action.threshold,
            ...state.keys[action.axis].threshold.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_GAIN: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          gain: [
            ...state.keys[action.axis].gain.slice(0, action.zone),
            action.gain,
            ...state.keys[action.axis].gain.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_CC: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          cc: [
            ...state.keys[action.axis].cc.slice(0, action.zone),
            action.cc,
            ...state.keys[action.axis].cc.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_OFFSET: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          offset: [
            ...state.keys[action.axis].offset.slice(0, action.zone),
            action.offset,
            ...state.keys[action.axis].offset.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_RELATIVE_START: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          relative_start: [
            ...state.keys[action.axis].relative_start.slice(0, action.zone),
            action.relative_start,
            ...state.keys[action.axis].relative_start.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_CURVE: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          curve: [
            ...state.keys[action.axis].curve.slice(0, action.zone),
            action.curve,
            ...state.keys[action.axis].curve.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_ZERO_ON_RELEASE: {
      return {
        ...state,
        keys: state.keys.slice(0, action.axis)
        .concat([{
          ...state.keys[action.axis],
          zero_on_release: [
            ...state.keys[action.axis].zero_on_release.slice(0, action.zone),
            action.zero_on_release,
            ...state.keys[action.axis].zero_on_release.slice(action.zone + 1)
          ]
        }])
        .concat(state.keys.slice(action.axis + 1))
      }
    }
    case SET_KEY_AXIS_INVERT: {
      let invert_axis = 'y'
      if(action.axis === 2) invert_axis = 'z'
      console.log(`${invert_axis}_axis_invert`, state[`${invert_axis}_axis_invert`], action.invert)
      return {
        ...state,
        [`${invert_axis}_axis_invert`]: [
          ...state[`${invert_axis}_axis_invert`].slice(0, action.zone),
          action.invert,
          ...state[`${invert_axis}_axis_invert`].slice(action.zone + 1)
        ]
      }
    }

    // Zones
    case SET_ZONE_SPLIT_KEY: {
      return { ...state, zone_split_key_num: action.key }
    }
    case SET_ZONE_CURVE: {
      return {
        ...state,
        splits: state.splits.slice(0, action.zone)
        .concat([{
          ...state.splits[action.zone],
          curve: action.curve
        }])
        .concat(state.splits.slice(action.zone + 1))
      }
    }
    case SET_MIDI_DEVICE_CHANNEL: {
      return {
        ...state,
        device_channels: [
          ...state.device_channels.slice(0, action.zone),
          action.channel,
          ...state.device_channels.slice(action.zone + 1)
        ]
      }
    }
    case SET_MPE_DEVICE_CHANNEL: {
      return {
        ...state,
        number_of_MPE_member_channels: [
          ...state.number_of_MPE_member_channels.slice(0, action.zone),
          action.channel,
          ...state.number_of_MPE_member_channels.slice(action.zone + 1)
        ]
      }
    }
    // Slider
    case SET_SLIDER_MODE: {
      return {
        ...state,
        sliders: state.sliders.slice(0, action.slider)
        .concat([{
          ...state.sliders[action.slider],
          mode: action.mode
        }])
        .concat(state.sliders.slice(action.slider + 1))
      }
    }
    case SET_SLIDER_CC: {
      return {
        ...state,
        sliders: state.sliders.slice(0, action.slider)
        .concat([{
          ...state.sliders[action.slider],
          cc: action.cc
        }])
        .concat(state.sliders.slice(action.slider + 1))
      }
    }
    case SET_SLIDER_ZONE: {
      return {
        ...state,
        sliders: state.sliders.slice(0, action.slider)
        .concat([{
          ...state.sliders[action.slider],
          zone: action.zone
        }])
        .concat(state.sliders.slice(action.slider + 1))
      }
    }
    case SET_SLIDER_SENSITIVITY: {
      return { ...state, slider_sensitivity: action.sensitivity }
    }
    case SET_LED_MODE: {
      return { ...state, led_mode: action.mode }
    }

    // pedals
    case SET_PEDAL_MODE: {
      return {
        ...state,
        pedals: state.pedals.slice(0, action.pedal)
        .concat([{
          ...state.pedals[action.pedal],
          mode: action.mode
        }])
        .concat(state.pedals.slice(action.pedal + 1))
      }
    }
    case SET_PEDAL_CC: {
      return {
        ...state,
        pedals: state.pedals.slice(0, action.pedal)
        .concat([{
          ...state.pedals[action.pedal],
          cc: action.cc
        }])
        .concat(state.pedals.slice(action.pedal + 1))
      }
    }
    case SET_PEDAL_THRESHOLD: {
      return {
        ...state,
        pedals: state.pedals.slice(0, action.pedal)
        .concat([{
          ...state.pedals[action.pedal],
          threshold: action.threshold
        }])
        .concat(state.pedals.slice(action.pedal + 1))
      }
    }
    case SET_PEDAL_ZONE: {
      return {
        ...state,
        pedals: state.pedals.slice(0, action.pedal)
        .concat([{
          ...state.pedals[action.pedal],
          zone: action.zone
        }])
        .concat(state.pedals.slice(action.pedal + 1))
      }
    }

    // Advanced
    case SET_MPE_MODE: {
      return { ...state, mpe_mode: action.mode }
    }
    case SET_DEVICE_SENSITIVITY: {
      return { ...state, device_sensitivity: action.sensitivity }
    }
    case SET_RELEASE_VELOCITY_ON: {
      return {
        ...state,
        release_velocity: [
          ...state.release_velocity.slice(0, action.zone),
          action.on,
          ...state.release_velocity.slice(action.zone + 1)
        ]
      }
    }
    case SET_NOTE_ON_CURVE_INDEX: {
      return {
        ...state,
        note_on_velocity_table_index: [
          ...state.note_on_velocity_table_index.slice(0, action.zone),
          action.index,
          ...state.note_on_velocity_table_index.slice(action.zone + 1)
        ]
      }
    }
    case SET_RELEASE_VELOCITY_CURVE_INDEX: {
      return {
        ...state,
        release_velocity_table_index: [
          ...state.release_velocity_table_index.slice(0, action.zone),
          action.index,
          ...state.release_velocity_table_index.slice(action.zone + 1)
        ]
      }
    }

    case SET_PITCH_BEND_MASTER_RANGE: {
      return {
        ...state,
        pitch_bend: {
          ...state.pitch_bend,
          master_range: [
            ...state.pitch_bend.master_range.slice(0, action.zone),
            action.range,
            ...state.pitch_bend.master_range.slice(action.zone + 1)
          ]
        }
      }
    }
    case SET_PITCH_BEND_MEMBER_RANGE: {
      return {
        ...state,
        pitch_bend: {
          ...state.pitch_bend,
          member_range: [
            ...state.pitch_bend.member_range.slice(0, action.zone),
            action.range,
            ...state.pitch_bend.member_range.slice(action.zone + 1)
          ]
        }
      }
    }

    case SET_PITCH_BEND_RETURN_MODE: {
      return {
        ...state,
        pitch_bend: {
          ...state.pitch_bend,
          return_mode: [
            ...state.pitch_bend.return_mode.slice(0, action.zone),
            action.mode,
            ...state.pitch_bend.return_mode.slice(action.zone + 1)
          ]
        }
      }
    }
    case SET_PITCH_BEND_RETURN_TIME: {
      return {
        ...state,
        pitch_bend: {
          ...state.pitch_bend,
          return_time: [
            ...state.pitch_bend.return_time.slice(0, action.zone),
            action.time,
            ...state.pitch_bend.return_time.slice(action.zone + 1)
          ]
        }
      }
    }
    case SET_PITCH_BEND_RETURN_CURVE: {
      return {
        ...state,
        pitch_bend: {
          ...state.pitch_bend,
          return_curve: [
            ...state.pitch_bend.return_curve.slice(0, action.zone),
            action.index,
            ...state.pitch_bend.return_curve.slice(action.zone + 1)
          ]
        }
      }
    }

    case SET_OCTAVE: {
      return {
        ...state,
        octave: [
          ...state.octave.slice(0, action.zone),
          action.octave,
          ...state.octave.slice(action.zone + 1)
        ]
      }
    }
    case SET_TRANSPOSE: {
      return {
        ...state,
        transpose: [
          ...state.transpose.slice(0, action.zone),
          action.transpose,
          ...state.transpose.slice(action.zone + 1)
        ]
      }
    }

    default:
      return state
  }
}
