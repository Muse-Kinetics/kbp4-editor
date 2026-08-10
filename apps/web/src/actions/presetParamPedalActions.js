// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { SET_PEDAL_MODE, SET_PEDAL_CC, SET_PEDAL_THRESHOLD, SET_PEDAL_ZONE } from './actionTypes'

export const setPedalMode = (index, mode) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PEDAL_MODE,
      pedal: index,
      mode: mode
    })
  }
};
export const setPedalCC = (index, cc) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PEDAL_CC,
      pedal: index,
      cc: cc
    })
  }
};
export const setPedalThreshold = (index, threshold) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PEDAL_THRESHOLD,
      pedal: index,
      threshold: threshold
    })
  }
};
export const setPedalZone = (index, zone) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PEDAL_ZONE,
      pedal: index,
      zone: zone
    })
  }
};
