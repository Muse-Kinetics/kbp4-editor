// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import omit from 'lodash.omit'
import initialState from './initialState'

import {
  SENSORS_LOADED,
  SET_KEY_SENSOR,
  SET_OVERRIDE_SENSOR,
  REMOVE_OVERRIDE_SENSOR,
  RESET_OVERRIDES
 } from '../actions/actionTypes'

export default function keySensorsReducer(state = initialState.keySensors, action) {
  switch (action.type) {
    case SENSORS_LOADED:
      return {
        ...state,
        sensorsLoaded: action.loaded
      }

    case SET_KEY_SENSOR:
      const ganging = action.gangType === 0 ? 'ganged_2' : 'ganged_12'

      return {
        ...state,
        [ganging]: [
          ...state[ganging].slice(0, action.bankIndex),
          [
            ...state[ganging][action.bankIndex].slice(0, action.octave),
            [
              ...state[ganging][action.bankIndex][action.octave].slice(0, action.key),
              [
                ...state[ganging][action.bankIndex][action.octave][action.key].slice(0, action.side),
                (ganging === 'ganged_2')
                ?
                [
                  ...state[ganging][action.bankIndex][action.octave][action.key][action.side].slice(0, action.sensor),
                  action.sensorgain,
                  ...state[ganging][action.bankIndex][action.octave][action.key][action.side].slice(action.sensor + 1),
                ]
                :
                [action.sensorgain]
                ,
                ...state[ganging][action.bankIndex][action.octave][action.key].slice(action.side + 1)
              ],
              ...state[ganging][action.bankIndex][action.octave].slice(action.key + 1)
            ],
            ...state[ganging][action.bankIndex].slice(action.octave + 1)
          ],
          ...state[ganging].slice(action.bankIndex + 1)
        ]
      }

    case RESET_OVERRIDES:
      return {
        ...state,
        overrides: {}
      }

    case SET_OVERRIDE_SENSOR:
      return {
        ...state,
        overrides: {
          ...state.overrides,
          [action.sensor]: action.value
        }
      }

    case REMOVE_OVERRIDE_SENSOR:
      return {
        ...state,
        overrides: omit(state.overrides, action.id)
      }

    default:
      return state
  }
}
/*
keySensors: {
  ganged_2: {
    bank_0: {
      octave: {
          key_0: {
            side_0: [0,0,0,0,0,0],
            side_1: [0,0,0,0,0,0]
          }
      }
    }
  }
}
*/
