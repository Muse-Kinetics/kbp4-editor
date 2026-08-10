// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import Select from 'react-simpler-select'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import './UI/Select.css'
import './UI/Input.css'
import './Pedals.css'

import NumberInput from  './UI/NumberInput'

import tooltips from '../constants/tooltips.json'

// Z axis has limited options
const pedalModeOptions = [
  { label: 'Off', value: 0},
  { label: 'CC', value: 1}
]
const pedalZoneOptions = [
  { label: 'Lower', value: 0},
  { label: 'Upper', value: 1},
  { label: 'Both', value: 2}
]

class Pedal extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      pedalIndex,
      pedals,
      setMode,
      setCC,
      setZone,
      tooltip
    } = this.props

    return (
      <div
        className={
          classnames(
            'pedal',
            `pedal-${pedalIndex}`,
            {'off': pedals[pedalIndex].mode === 0},
            {"lower": pedals[pedalIndex].mode !== 0 && pedals[pedalIndex].zone === 0},
            {"upper": pedals[pedalIndex].mode !== 0 && pedals[pedalIndex].zone === 1},
            {"dual-zone": pedals[pedalIndex].mode !== 0 && pedals[pedalIndex].zone === 2}
          )}
          data-tip={tooltips[`editor-pedals-${pedalIndex === 0 ? 'p1' : 'p2'}`]}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!tooltip}
        >
        <div className="pedal-settings">
          <label
            className={classnames("pedal-mode-label", {"has-cc": (pedals[pedalIndex].mode === 1)})}
            data-tip={tooltips['editor-pedal-mode']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Mode
            <Select
              name="pedal-mode-select"
              value={pedals[pedalIndex].mode}
              options={pedalModeOptions}
              onChange={(value) => setMode(pedalIndex, value)}
            />
          </label>
          { (pedals[pedalIndex].mode === 1) && <label
            className="pedal-cc-label"
            data-tip={tooltips['editor-pedal-cc']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >CC<NumberInput
            name="pedal-cc"
            min={0} max={127}
            value={pedals[pedalIndex].cc}
            onChange={(value) => {
              if(value < 0 || value === null) return
              setCC(pedalIndex, (value > 127) ? 127 : value)
            }} />
          </label>
          }
          { (pedals[pedalIndex].mode !== 0) && <label
            className="pedal-zone-label"
            data-tip={tooltips['editor-pedal-zone']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Zone
            <Select
              name="pedal-zone-select"
              value={pedals[pedalIndex].zone}
              options={pedalZoneOptions}
              onChange={(zone) => setZone(pedalIndex, zone)}
            />
        </label> }
        </div>
      </div>
    )
  }
}

export default Pedal
