// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import Select from 'react-simpler-select'

import NumberInput from './UI/NumberInput'

import './UI/Select.css'

import tooltips from '../constants/tooltips.json'

const LEDModeOptions = [
  { label: 'Full', value: 0},
  { label: 'Reduced', value: 1}
]

class AdvancedSliders extends Component {

  render() {
    const {
      LEDMode,
      sliderSensitivity,
      setSliderSensitivity,
      setLEDMode,
      showTooltips
    } = this.props

    return (
      <div className="grid-group sliders">
        <h3>Sliders</h3>
        <div className="grid-item label-select-grid slider-sensitivity">
        <label
          className="slider-sensitivity-label"
          data-tip={tooltips['editor-advanced-slider-sensitivity']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Activation<NumberInput
          name="slider-sensitivity"
          min={0} max={254}
          value={sliderSensitivity}
          onChange={(value) => {
            if(value < 0 || value === null) return
            setSliderSensitivity((value > 254) ? 254 : value)
          }} />
        </label>
        </div>
        <div className="grid-item label-select-grid led-mode">
        <label
          className="slider-led-mode-label"
          data-tip={tooltips['editor-advanced-slider-led-mode']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >
          LED Mode
          <Select
            name="led-mode-select"
            value={LEDMode}
            options={LEDModeOptions}
            onChange={(value) => setLEDMode(~~value)}
          />
        </label>
        </div>
      </div>
    )
  }
}

export default AdvancedSliders
