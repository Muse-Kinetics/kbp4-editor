// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SET_KEY_AXIS_MODE,
  SET_KEY_AXIS_THRESHOLD,
  SET_KEY_AXIS_GAIN,
  SET_KEY_AXIS_CC,
  SET_KEY_AXIS_OFFSET,
  SET_KEY_AXIS_RELATIVE_START,
  SET_KEY_AXIS_CURVE,
  SET_KEY_AXIS_ZERO_ON_RELEASE,
  SET_KEY_AXIS_INVERT
} from './actionTypes'

export const setKeyAxisMode = (index, mode) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_MODE,
      axis: index,
      mode: mode,
      zone: zone
    })
  }
};
export const setKeyAxisThreshold = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_THRESHOLD,
      axis: index,
      threshold: value,
      zone: zone
    })
  }
};
export const setKeyAxisGain = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_GAIN,
      axis: index,
      gain: value,
      zone: zone
    })
  }
};
export const setKeyAxisCC = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_CC,
      axis: index,
      cc: value,
      zone: zone
    })
  }
};
export const setKeyAxisOffset = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_OFFSET,
      axis: index,
      offset: value,
      zone: zone
    })
  }
};
export const setKeyAxisRelativeStart = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_RELATIVE_START,
      axis: index,
      relative_start: value,
      zone: zone
    })
  }
};
export const setKeyAxisCurve = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_CURVE,
      axis: index,
      curve: value,
      zone: zone
    })
  }
};
export const setKeyAxisZeroOnRelease = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_ZERO_ON_RELEASE,
      axis: index,
      zero_on_release: value,
      zone: zone
    })
  }
};
export const setKeyAxisInvert = (index, value) => {
  return (dispatch, getState) => {
    const zone = getState().editor.selectedZone
    dispatch({
      type: SET_KEY_AXIS_INVERT,
      axis: index,
      invert: value,
      zone: zone
    })
  }
};
