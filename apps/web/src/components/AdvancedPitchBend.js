// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import Select from 'react-simpler-select'

import './UI/Select.css'
import './UI/Input.css'

import NumberInput from './UI/NumberInput'

import { capitalize } from '../utilities'

import velocityCurves from '../constants/velocityCurves.json'
import tooltips from '../constants/tooltips.json'

const curves = Object.keys(velocityCurves).map(key => ({value: velocityCurves[key], label: capitalize(key)}))

const toggleOptions = [
  { label: 'Off', value: 0},
  { label: 'On', value: 1}
]

const pitchBendRangeOptions = [
  { label: '+/- 0 semitones', value: 0},
  { label: '+/- 1/8 semitones', value: 1},
  { label: '+/- 1/4 semitones', value: 2},
  { label: '+/- 1/2 semitones', value: 3},
  { label: '+/- 1 semitone', value: 4},
  { label: '+/- 2 semitones', value: 5},
  { label: '+/- 3 semitones', value: 6},
  { label: '+/- 4 semitones', value: 7},
  { label: '+/- 5 semitones', value: 8},
  { label: '+/- 7 semitones', value: 9},
  { label: '+/- 10 semitones', value: 10},
  { label: '+/- 12 semitones', value: 11}
]

const AdvancedPitchBend = (props) => {
  const {
    zone,
    pitchBend,
    setMasterRange,
    setMemberRange,
    setReturnMode,
    setReturnTime,
    setReturnCurve,
    openCurves,
    showTooltips
  } = props

  const {
    master_range: masterRange,
    member_range: memberRange,
    return_mode: returnMode,
    return_time: returnTime,
    return_curve: returnCurve
  } = pitchBend

  return (
      <div className="grid-group pitch-bend">
        <h3>Pitch Bend</h3>
        <label
          className="slider-bend-range-label"
          data-tip={tooltips['editor-advanced-pitch-bend-slider-range']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >
          Slider Range
          <Select
            name="slider-bend-range-select"
            value={masterRange[zone]}
            options={pitchBendRangeOptions}
            onChange={(value) => setMasterRange(value)}
          />
        </label>
        <label
          className="key-bend-range-label"
          data-tip={tooltips['editor-advanced-pitch-bend-key-range']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >
          Key Range
          <Select
            name="key-bend-range-select"
            value={memberRange[zone]}
            options={pitchBendRangeOptions}
            onChange={(value) => setMemberRange(value)}
          />
        </label>
        <label
          className="pitch-bend-return-mode-label"
          data-tip={tooltips['editor-advanced-pitch-bend-return-mode']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >
          Return Mode
          <Select
            name="pitch-bend-select"
            value={returnMode[zone]}
            options={toggleOptions}
            onChange={(value) => setReturnMode(value)}
          />
        </label>
        <label
          className="pitch-bend-return-time-label"
          data-tip={tooltips['editor-advanced-pitch-bend-return-time']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Return Time
          <NumberInput
            name="pitch-bend-return-time"
            value={returnTime[zone]}
            min={0.1}
            max={1.10}
            step={0.10}
            precision={2}
            format={function addSeconds(value) {
                return (value < 0.1 || value === null) ? '0.1 seconds' : value + ' seconds'
            }}
            disabled={returnMode[zone] === 0 ? true : false}
            onFocus={ e => e.target.select() }
            onChange={value => {
              if(value < 0.1 || value === null) return
              setReturnTime(parseFloat(value > 1.10 ? 1.10 : value))
            }}
          />
        </label>
        { false && <label
          className="pitch-bend-return-curve-label"
          data-tip={tooltips['editor-advanced-pitch-bend-return-curve']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >
          Return Curve
          <Select
            name="pitch-bend-select-curve"
            value={returnCurve[zone]}
            options={curves}
            onChange={(value) => {
              if(value === '127') {
                openCurves('pitchBend')
              } else {
                setReturnCurve(value)
              }
            }}
          />
      </label> }
    </div>
  )
}

export default AdvancedPitchBend
