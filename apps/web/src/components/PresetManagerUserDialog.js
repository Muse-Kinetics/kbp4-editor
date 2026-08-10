// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import Button from './UI/Button'
import Input from './UI/Input'

import {
  togglePresetDialog,
  setUserPresetName,
  saveNewPreset
} from '../actions/'

import tooltips from '../constants/tooltips.json'

class PresetManagerUserDialog extends Component {
  state = {
    newPresetName: false,
    isDuplicateName: false
  }

  nameField = React.createRef()
  saveButton = React.createRef()

  componentDidMount() {
    ReactTooltip.rebuild()
    this.nameField.current.focus()
  }

  handleEnterPressed = (e) => {
    if(!!this.state.newPresetName && e.key === 'Enter') this.props.toggleDialogAndSave(this.props.currentPreset, this.props.userPresetName)
  }

  render() {
    const {
      toggleUserPresetDialog,
      toggleDialogAndSave,
      setPresetName,
      userPresetName,
      currentPreset,
      showTooltips,
      user
    } = this.props

    return (
      <div className="preset-manager-user">
        <div className="txt-upper presets-label">user</div>
        <div className={classnames('preset-name-form', {'duplicate': this.state.isDuplicateName})}>
          <Input
            name="preset-name"
            min="1"
            max="32"
            inputRef={this.nameField}
            placeholder="Name Your Preset"
            data-tip={tooltips['preset-user-save-as-name']}
            data-multiline="true"
            data-tip-disable={!showTooltips}
            onKeyPress={this.handleEnterPressed}
            onInput={
              (e) => {
                const presetName = e.target.value
                // check if preset name already exists and prevent saving if true
                this.setState({
                  newPresetName: presetName,
                  isDuplicateName: user.some(preset => presetName === preset.name)
                })

                setPresetName(presetName)
              }
            } />
          <Button
            name="cancel"
            data-tip={tooltips['preset-user-save-as-cancel']}
            data-multiline="true"
            data-tip-disable={!showTooltips}
            onClick={toggleUserPresetDialog}
          />
          <Button
            name="save"
            data-tip={tooltips['preset-user-save-as-save']}
            data-multiline="true"
            data-tip-disable={!showTooltips}
            disabled={!this.state.newPresetName || this.state.isDuplicateName}
            onClick={() => toggleDialogAndSave(currentPreset, userPresetName)}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.presets.user,
    userPresetName: state.editor.userPresetName,
    currentPreset: state.currentPreset,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleUserPresetDialog: () => {
      dispatch(togglePresetDialog())
    },
    setPresetName: (name) => {
      dispatch(setUserPresetName(name))
    },
    toggleDialogAndSave: (preset, name) => {
      dispatch(saveNewPreset(preset, name))// save user preset to localStorage
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetManagerUserDialog)
