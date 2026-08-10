// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  SET_PREFERENCE_TOOLTIPS,
  SET_PREFERENCE_AUTOHIDE_SPLITS
} from './actionTypes'

export const toggleTooltips = (active) => ({type: SET_PREFERENCE_TOOLTIPS, active: active})
export const toggleAutohideZoneSlider = (active) => ({type: SET_PREFERENCE_AUTOHIDE_SPLITS, active: active})
