// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import initialState from './initialState'

import {
  SAVE_PRESET,
  SAVE_NEW_PRESET,
  DELETE_PRESET,
  ADD_PRESET,
  RESET_DEVICE_PRESETS_IN_STATE
 } from '../actions/actionTypes'

export default function presetsReducer(state = initialState.presets, action) {
  switch (action.type) {
    case ADD_PRESET:
      return { ...state, [action.category]: [...state[action.category], action.preset] }

    case SAVE_PRESET:
      return {
        ...state,
        user: [
          ...state.user.slice(0, action.id.split('-')[1]),
          { ...action.preset },
          ...state.user.slice(action.id.split('-')[1] + 1)
        ]
      }

    case SAVE_NEW_PRESET:
      return { ...state, user: [ ...state.user, { ...action.preset, name: action.name } ] }

    case DELETE_PRESET:
      return { ...state, user: state.user.filter(preset => action.name !== preset.name) }

    case RESET_DEVICE_PRESETS_IN_STATE:
      return { ...state, device: [] }

    default:
      return state
  }
}
