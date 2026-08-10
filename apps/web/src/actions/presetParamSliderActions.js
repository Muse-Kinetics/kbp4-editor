// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { SET_SLIDER_MODE, SET_SLIDER_CC, SET_SLIDER_ZONE, SET_SLIDER_SENSITIVITY, SET_LED_MODE } from './actionTypes'

export const setSliderMode = (index, mode) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_SLIDER_MODE,
      slider: index,
      mode: mode
    })
  }
};
export const setSliderCC = (index, cc) => {
  return (dispatch) => {
    dispatch({
      type: SET_SLIDER_CC,
      slider: index,
      cc: cc
    })
  }
};
export const setSliderZone = (index, zone) => {
  return (dispatch) => {
    dispatch({
      type: SET_SLIDER_ZONE,
      slider: index,
      zone: zone
    })
  }
};
export const setSliderSensitivity = (value) => {
  return {
    type: SET_SLIDER_SENSITIVITY,
    sensitivity: value
  }
};
export const setLEDMode = (value) => {
  return {
    type: SET_LED_MODE,
    mode: value
  }
};
