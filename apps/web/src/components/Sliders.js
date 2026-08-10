// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'

import './Sliders.css'

import Slider from './Slider'

// import tooltips from '../constants/tooltips.json'

import {
  setSliderMode,
  setSliderCC,
  setSliderZone
} from '../actions/'

const Sliders = (props) => {
  const {
    sliders,
    onSetSliderMode,
    onSetSliderCC,
    onSetSliderZone,
    showTooltips
  } = props

  return (
    <div className="sliders">
      {
        [0,1,2,3].map(sliderIndex => {
          return (
            <Slider
              key={sliderIndex}
              sliderIndex={sliderIndex}
              sliders={sliders}
              setMode={onSetSliderMode}
              setCC={onSetSliderCC}
              setZone={onSetSliderZone}
              tooltip={showTooltips}
            />
          )
        })
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    sliders: state.currentPreset.sliders,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetSliderMode: (slider, mode) => {
      dispatch(setSliderMode(slider, ~~mode))
    },
    onSetSliderCC: (slider, cc) => {
      dispatch(setSliderCC(slider, ~~cc))
    },
    onSetSliderZone: (slider, zone) => {
      dispatch(setSliderZone(slider, ~~zone))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sliders)
