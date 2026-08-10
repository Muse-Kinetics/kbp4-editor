// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-simpler-select'
import compareVersions from 'compare-versions'

import './UI/Select.css'

import { buildPresetMenu, getPresetFromID } from '../utilities'

import PresetManagerSelectDestination from './PresetManagerSelectDestination'

import tooltips from '../constants/tooltips.json'

import {
  setCurrentPreset,
  initialPresetLoad,
  networkStatus
} from '../actions/'

class PresetManagerSelect extends Component {
  componentDidMount() {
    const component = this, timeLimit = 1500, ricTimeout = 1000, mountedTime = new Date().getTime()
    if('requestIdleCallback' in window){
      component.idle = window.requestIdleCallback(function loadInitialPreset(deadline) {
        const {
          presets,
          deviceConnected,
          devicePresetsLoaded,
          onInitialPresetLoad,
          minimumCompatibleFirmwareVersion
        } = component.props

        let presetName, timeLimitReached = new Date().getTime() - mountedTime > timeLimit

        if(timeLimitReached || (deviceConnected && devicePresetsLoaded)) {
          if(presets.device.length > 0) {
            presetName = 'device-0'
          } else if (presets.user.length > 0 && presets.user.every(preset => compareVersions(preset.preset_version.join('.'), minimumCompatibleFirmwareVersion) >= 0)) {
            presetName = 'user-0'
          } else if (presets.factory.length > 0) {
            presetName = 'factory-0'
          }
          // load initial preset except when in bootlader
          if(presetName) {
            onInitialPresetLoad(getPresetFromID(presets, presetName), presetName)
          } else if(window.KBoardPro4.bootloader) {
            console.warn('>> K-Board Pro 4: no initial preset could be loaded, in Bootloader Mode');
          } else {
            console.warn('>> K-Board Pro 4: no initial preset could be loaded');
          }
        } else {
          component.idle = window.requestIdleCallback(loadInitialPreset, { timeout: ricTimeout })
        }
      }, { timeout: ricTimeout })
    } else {
      // setTimeout
    }
  }

  componentDidUpdate(){
    this.props.onSetNetworkStatus()
  }

  componentWillUnmount() {
    window.cancelIdleCallback(this.idle)
  }

  render() {
    const {
      presets,
      selectedPreset,
      onPresetChange,
      showTooltips
    } = this.props

    return (
      <div className="preset-manager-select">
        <div className="presets-label">presets</div>
        <div className="presets-box">
          <Select
            name="presets"
            value={selectedPreset}
            data-tip={tooltips['preset-select']}
            data-multiline="true"
            data-tip-disable={!showTooltips}
            options={buildPresetMenu(presets)}
            onChange={(id) => onPresetChange(getPresetFromID(presets, id), id)}
          />
          <PresetManagerSelectDestination />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    minimumCompatibleFirmwareVersion: state.device.minimumCompatibleFirmwareVersion,
    presets: state.presets,
    selectedPreset: state.editor.selectedPreset,
    deviceConnected: state.device.connected,
    devicePresetsLoaded: state.editor.devicePresetsLoaded,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onInitialPresetLoad: (preset, id) => {
      dispatch(initialPresetLoad(preset, id))
    },
    onPresetChange: (preset, id) => {
      dispatch(setCurrentPreset(preset, id))
    },
    onSetNetworkStatus: () => {
      dispatch(networkStatus())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetManagerSelect)
