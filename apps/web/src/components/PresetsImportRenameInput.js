// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import './UI/Input.css'

import Input from './UI/Input'

import tooltips from '../constants/tooltips.json'

import { setImportedName } from '../actions'

class PresetsImportRenameInput extends Component {
  state = {
    isDuplicateName: false
  }

  nameField = React.createRef()

  render () {
    const {
      userPresets,
      onSetImportedName,
      showTooltips
    } = this.props

    const presets = userPresets.map(p => p.name)

    return (
      <Input
        name={classnames('preset-rename', {'duplicate': this.state.isDuplicateName})}
        min="1"
        max="32"
        inputRef={this.nameField}
        placeholder={this.props.name}
        data-tip={tooltips['preset-import-input']}
        data-multiline="true"
        data-place="bottom"
        data-tip-disable={!showTooltips}
        onInput={
          (e) => {
            const presetName = e.target.value
            // check if preset name already exists and prevent saving if true
            this.setState({
              isDuplicateName: presets.some(originalName => presetName === originalName)
            })
            // set name
            if(!presets.some(originalName => presetName === originalName)){
              onSetImportedName(this.props.index, presetName)
            } else {
              onSetImportedName(this.props.index, '')
            }
          }
        }
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userPresets: state.presets.user,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetImportedName: (index, name) => {
      dispatch(setImportedName(index, name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetsImportRenameInput)
