// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import Select from 'react-simpler-select'

import './UI/Select.css'

import tooltips from '../constants/tooltips.json'

const toggleOptions = [
  { label: 'Off', value: 0},
  { label: 'On', value: 1}
]

const AdvancedMIDI = (props) => {
  const {
    mpeMode,
    setMPEMode,
    showTooltips
  } = props

  return (
    <div className="grid-group midi">
      <h3>MIDI</h3>
      <div className="grid-item label-select-grid mpe-mode">
        <label
          className="mpe-mode-label"
          data-tip={tooltips['editor-advanced-mpe']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >
          MPE Mode
          <Select
            name="mpe-mode-select"
            value={mpeMode}
            options={toggleOptions}
            onChange={(value) => setMPEMode(value)}
          />
        </label>
      </div>
    </div>
  )
}

export default AdvancedMIDI
