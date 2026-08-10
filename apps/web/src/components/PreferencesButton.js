// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// import { ipcRenderer } from 'electron'
// import isElectron from 'is-electron'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Button from './UI/Button'

import tooltips from '../constants/tooltips.json'

import {
  openPreferences
} from '../actions/'

class PreferencesButton extends Component {
  componentDidMount() {
    // if(isElectron()) ipcRenderer.on('preferences', (event, value) => this.props.onOpenPreferences())
  }

  componentWillUnmountMount() {
    // if(isElectron()) ipcRenderer.off('preferences', (event, value) => this.props.onOpenPreferences())
  }

  render() {
    const {
      onOpenPreferences,
      showTooltips
    } = this.props

    return (
      <Button
        name="Preferences"
        onClick={ onOpenPreferences }
        data-tip={tooltips['editor-open-preferences']}
        data-multiline="true"
        data-place="top"
        data-tip-disable={!showTooltips}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deviceConnected: state.device.connected,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  /*
  {
    onPresetGainChange : setPresetGain,
    onPlayModeChange : selectPlayMode,
    onNoteLengthChange : setMIDINOteLength,
    onDampThresholdChange : setDampThreshold
  }
  */
  return {
    onOpenPreferences: () => {
      dispatch(openPreferences(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesButton)
