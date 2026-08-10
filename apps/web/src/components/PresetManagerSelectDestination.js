// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'

import Button from './UI/Button'

import {
  savePreset,
  selectPresetDetination
} from '../actions/'

import tooltips from '../constants/tooltips.json'

const PresetManagerSelectDestination = (props) => {
  const {
    deviceConnected,
    destination,
    onDestinationChange,
    onSavePreset,
    showTooltips
  } = props

  return (
    <div className="preset-manager-select-destination">
      <div
        className="button-group"
        data-tip={tooltips['preset-destination']}
        data-multiline="true"
        data-tip-disable={!showTooltips}
        >
        <div className="send-label">Select Slot: </div>
          <Button
            kind="square"
            name={1}
            index={1}
            value={1}
            toggle={destination}
            onClick={ onDestinationChange }
            disabled={!deviceConnected}
          />
          <Button
            kind="square"
            name={2}
            index={2}
            value={2}
            toggle={destination}
            onClick={ onDestinationChange }
            disabled={!deviceConnected}
          />
          <Button
            kind="square"
            name={3}
            index={3}
            value={3}
            toggle={destination}
            onClick={ onDestinationChange }
            disabled={!deviceConnected}
          />
          <Button
            kind="square"
            name={4}
            index={4}
            value={4}
            toggle={destination}
            onClick={ onDestinationChange }
            disabled={!deviceConnected}
          />
      </div>
      <Button
        name={`SAVE TO K-Board Pro 4: Slot ${destination}`}
        value="save-to-k-board-pro-4"
        data-tip={tooltips['preset-save-to-device']}
        data-multiline="true"
        data-tip-disable={!showTooltips}
        disabled={!deviceConnected}
        onClick={ () => onSavePreset(destination) }
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    destination: state.editor.destination,
    deviceConnected: state.device.connected,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDestinationChange: (button) => {
      dispatch(selectPresetDetination(~~button.value))
    },
    onSavePreset: (destination) => {
      dispatch(savePreset(destination))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetManagerSelectDestination)
