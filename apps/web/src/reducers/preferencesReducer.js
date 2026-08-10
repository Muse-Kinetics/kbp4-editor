// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import initialState from './initialState'

import {
  SET_PREFERENCE_TOOLTIPS,
  SET_PREFERENCE_AUTOHIDE_SPLITS
 } from '../actions/actionTypes'

export default function preferencesReducer(state = initialState.editorPreferences, action) {
  switch (action.type) {

    case SET_PREFERENCE_TOOLTIPS:
      return { ...state, showTooltips: action.active }

    case SET_PREFERENCE_AUTOHIDE_SPLITS:
      return { ...state, autohideZoneBackground: action.active }

    default:
      return state
  }
}
