// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'

import Button from './UI/Button'

import { getPresetFromID, isUserPreset } from '../utilities'

import tooltips from '../constants/tooltips.json'

import {
  togglePresetDialog,
  savePresetToStorage,
  deletePreset,
  revertPreset
 } from '../actions/'

class PresetManagerUser extends Component {
  componentDidMount() {
    ReactTooltip.rebuild()
  }

  render() {
    const {
      presets,
      selectedPreset,
      toggleUserPresetDialog,
      revertablePreset,
      currentPresetName,
      currentPreset,
      onSavePreset,
      onRevertPreset,
      onDeletePreset,
      showTooltips
    } = this.props

    return (
      <div className="preset-manager-user">
        <div className="presets-label">user</div>
        <div className={classnames('presets-box', 'user', {'attention': revertablePreset})}>
          <div className="button-group">
            <Button
              name="save"
              value="save"
              data-tip={tooltips['preset-user-save']}
              data-multiline="true"
              data-tip-disable={!showTooltips}
              disabled={ !selectedPreset.includes('user') || !revertablePreset }
              onClick={() => onSavePreset(currentPreset, selectedPreset) } />
            <Button
              name="save as"
              value="save as"
              data-tip={tooltips['preset-user-save-as']}
              data-multiline="true"
              data-tip-disable={!showTooltips}
              onClick={toggleUserPresetDialog} />
          </div>
          <Button
            name="revert"
            value="revert"
            data-tip={tooltips['preset-user-revert']}
            data-multiline="true"
            data-tip-disable={!showTooltips}
            disabled={ !revertablePreset }
            onClick={() => onRevertPreset(getPresetFromID(presets, selectedPreset))} />
          <Button
            name="delete"
            value="delete"
            data-tip={tooltips['preset-user-delete']}
            data-type="error"
            data-multiline="true"
            data-tip-disable={!showTooltips}
            disabled={ !isUserPreset(selectedPreset) }
            onClick={() => onDeletePreset(currentPresetName, presets)} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    presets: state.presets,
    selectedPreset: state.editor.selectedPreset,
    revertablePreset: state.editor.revertablePreset,
    currentPresetName: state.currentPreset.name,
    currentPreset: state.currentPreset,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleUserPresetDialog: () => {
      dispatch(togglePresetDialog())
    },
    onSavePreset: (preset, id) => {
      dispatch(savePresetToStorage(preset, id))
    },
    onRevertPreset: (preset) => {
      dispatch(revertPreset(preset))
    },
    onDeletePreset: (name, presets) => {
      dispatch(deletePreset(name, presets))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetManagerUser)
