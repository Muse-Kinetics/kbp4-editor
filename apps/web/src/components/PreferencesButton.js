// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Button from './UI/Button'

import tooltips from '../constants/tooltips.json'

import {
  openPreferences
} from '../actions/'

class PreferencesButton extends Component {
  componentDidMount() {
    // In the desktop app the native menu (macOS "Preferences", Windows "Settings")
    // sends the 'preferences' IPC channel; open the same preferences modal so the
    // menu item and the on-screen button are aliases for one another.
    if(window.ipcRenderer) window.ipcRenderer.on('preferences', () => this.props.onOpenPreferences())
  }

  componentWillUnmount() {
    if(window.ipcRenderer) window.ipcRenderer.off('preferences')
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
