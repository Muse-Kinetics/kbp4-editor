// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import Button from './UI/Button'

import tooltips from '../constants/tooltips.json'

const AdvancedKeyGainButton = (props) => {
  const {
    openKeyGain,
    deviceConnected,
    showTooltips
  } = props

  return (
    <div className="grid-group key-gain">
      <h3>Sensor Adjustment</h3>
      <Button
        name="Open"
        data-tip={tooltips['editor-sensor-adjustment-open']}
        data-multiline="true"
        data-place="top"
        data-tip-disable={!showTooltips}
        disabled={!deviceConnected}
        onClick={ openKeyGain }
      />
    </div>
  )
}

export default AdvancedKeyGainButton
