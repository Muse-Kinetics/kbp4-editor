// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  OPEN_VELOCITY_CURVES,
  CLOSE_VELOCITY_CURVES,
  SELECT_VELOCITY_CURVE,
  SELECT_USER_CURVE,
  SET_USER_CURVE,
  RESET_USER_CURVES_STORE
} from './actionTypes'

import { setCurveEditorOpener } from './'

// a lot of these should be in the editor actions/reducer

export const openVelocityCurves = (opener) => {
  return (dispatch) => {
    dispatch({ type: OPEN_VELOCITY_CURVES })
    dispatch(setCurveEditorOpener(opener))
  }
};

export const closeVelocityCurves = () => {
  return ({type: CLOSE_VELOCITY_CURVES})
}

export const selectVelocityCurve = (index) => ({ type: SELECT_VELOCITY_CURVE, index: index });
export const selectUserCurve = (index) => ({ type: SELECT_USER_CURVE, index: index });

export const setUserCurve = (index, curve) => ({ type: SET_USER_CURVE, index: index, curve: [...curve] });
export const resetUserCurveStore = () => ({ type: RESET_USER_CURVES_STORE });
