// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import Select from 'react-simpler-select'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import './UI/Select.css'
import './UI/Input.css'

import NumberInput from  './UI/NumberInput'

import tooltips from '../constants/tooltips.json'

// Z axis has limited options
const sliderModeOptions = [
  { label: 'Off', value: 0},
  { label: 'Preset Select', value: 6},
  { label: 'Global Pitch Bend', value: 2},
  { label: 'CC', value: 1},
  { label: 'Octave 4', value: 3},
  { label: 'Octave 7', value: 4},
  { label: 'Transpose', value: 7},
  { label: 'Key Pitch Bend Range', value: 5},
  { label: 'Pitch Bend Return Time', value: 8}
]
const sliderZoneOptions = [
  { label: 'Lower', value: 0},
  { label: 'Upper', value: 1},
  { label: 'Both', value: 2}
]

class Slider extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      sliderIndex,
      sliders,
      setMode,
      setCC,
      setZone,
      tooltip
    } = this.props

    return (
      <div className={
          classnames(
            'slider',
            `slider-${sliderIndex}`,
            {'off': sliders[sliderIndex].mode === 0},
            {'has-cc': sliders[sliderIndex].mode === 1},
            {'no-zone': sliders[sliderIndex].mode === 6},
            {"lower": sliders[sliderIndex].mode !== 0 && sliders[sliderIndex].mode !== 6 && sliders[sliderIndex].zone === 0},
            {"upper": sliders[sliderIndex].mode !== 0 && sliders[sliderIndex].mode !== 6 && sliders[sliderIndex].zone === 1},
            {"dual-zone": sliders[sliderIndex].mode !== 0 && sliders[sliderIndex].mode !== 6 && sliders[sliderIndex].zone === 2}
          )
        }>
        <h3
          data-tip={tooltips['editor-sliders']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!tooltip}
          >{sliderIndex+1}</h3>
        <div
          className="slider-settings"
          data-tip={tooltips['editor-zone-curve']}
          data-multiline="true"
          data-place="bottom"
          data-tip-disable={!tooltip}
          >
          <label
            className="slider-mode-label"
            data-tip={tooltips[`editor-slider-mode${(sliders[sliderIndex].mode === 6) ? '-preset-warning' : ''}`]}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Mode
            <Select
              name="slider-mode-select"
              value={sliders[sliderIndex].mode}
              options={sliderModeOptions}
              onChange={(value) => setMode(sliderIndex, value)}
            />
          </label>
          { (sliders[sliderIndex].mode === 1) && <label
            className="slider-cc-label"
            data-tip={tooltips['editor-slider-cc']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >CC<NumberInput
            name="slider-cc"
            data-tip={tooltips['editor-fader-cc']}
            data-multiline="true"
            data-place="right"
            data-tip-disable={!tooltip}
            min={0} max={127}
            value={sliders[sliderIndex].cc}
            onChange={(value) => {
              if(value < 0 || value === null) return
              setCC(sliderIndex, (value > 127) ? 127 : value)
            }} />
          </label> }
          { (sliders[sliderIndex].mode !== 0 && sliders[sliderIndex].mode !== 6) && <label
            className="slider-zone-label"
            data-tip={tooltips['editor-slider-zone']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Zone
            <Select
              name="slider-zone-select"
              value={sliders[sliderIndex].zone}
              options={sliderZoneOptions}
              onChange={(zone) => setZone(sliderIndex, zone)}
            />
        </label> }
        </div>
      </div>
    )
  }
}

export default Slider
