// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import initialState from './initialState'

import {
  SET_USER_CURVE,
  RESET_USER_CURVES_STORE
 } from '../actions/actionTypes'

export default function userCurveReducer(state = initialState.userCurves, action) {
  switch (action.type) {
    case SET_USER_CURVE:
      return { ...state, ['usercurve-' + action.index]: [...action.curve] }

    case RESET_USER_CURVES_STORE:
      return {
        'usercurve-0': Array.from(Array(128).keys()),
        'usercurve-1': Array.from(Array(128).keys()),
        'usercurve-2': Array.from(Array(128).keys()),
        'usercurve-3': Array.from(Array(128).keys())
      }

    default:
      return state
  }
}
