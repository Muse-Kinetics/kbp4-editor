// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import './AdvancedSettings.css'

import AdvancedKeys from './AdvancedKeys'
import AdvancedPitchBend from './AdvancedPitchBend'
import AdvancedSliders from './AdvancedSliders'
import AdvancedKeyGainButton from './AdvancedKeyGainButton'

import {
  openKeyGainMode,
  setPitchBendMasterRange,
  setPitchBendMemberRange,
  setPitchBendReturnMode,
  setPitchBendReturnTime,
  setPitchBendReturnCurve,
  setDeviceSensitivity,
  setSliderSensitivity,
  setLEDMode,
  setNoteOffVelocityOn,
  openVelocityCurves,
  setReleaseVelocityCurve,
  setOctave,
  setTranspose,
  setSoloMessageType,
  setSoloMessageChannel,
  sendSoloMessage
} from '../actions/'

class AdvancedSettings extends Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      deviceConnected,
      onSetOctave,
      onSetTranspose,
      onSetPitchBendMasterRange,
      onSetPitchBendMemberRange,
      onSetPitchBendReturnMode,
      onSetPitchBendReturnTime,
      onSetPitchBendReturnCurve,
      onSetKeySensitivity,
      onSetSliderSensitivity,
      onSetLEDMode,
      onSetReleaseVelocity,
      onOpenVelocityCurves,
      onSetReleaseVelocityCurve,
      onSetSoloMessageType,
      onSetSoloMessageChannel,
      onSendSoloMessage,
      onOpenKeyGainMode,
      keySensitivity,
      sliderSensitivity,
      LEDMode,
      releaseVelocity,
      releaseVelocityCurve,
      selectedZone,
      soloMessageType,
      soloMessageChannel,
      pitchBend,
      octave,
      transpose,
      sliders,
      showTooltips
    } = this.props

    return (
      <div className={classnames("advanced-settings", {"lower-zone-active": selectedZone === 0, "upper-zone-active": selectedZone === 1})}>
        <AdvancedKeys
          zone={selectedZone}
          octave={octave}
          transpose={transpose}
          sliders={sliders}
          soloMessageType={soloMessageType}
          soloMessageChannel={soloMessageChannel}
          sendSoloMessage={onSendSoloMessage}
          keySensitivity={keySensitivity}
          releaseVelocity={releaseVelocity}
          releaseVelocityCurve={releaseVelocityCurve}
          setKeySensitivity={onSetKeySensitivity}
          setReleaseVelocity={onSetReleaseVelocity}
          setReleaseVelocityCurve={onSetReleaseVelocityCurve}
          openCurves={onOpenVelocityCurves}
          setOctave={onSetOctave}
          setTranspose={onSetTranspose}
          setSoloMessageType={onSetSoloMessageType}
          setSoloMessageChannel={onSetSoloMessageChannel}
          deviceConnected={deviceConnected}
          showTooltips={showTooltips}
        />
        <AdvancedPitchBend
          zone={selectedZone}
          pitchBend={pitchBend}
          setMasterRange={onSetPitchBendMasterRange}
          setMemberRange={onSetPitchBendMemberRange}
          setReturnMode={onSetPitchBendReturnMode}
          setReturnTime={onSetPitchBendReturnTime}
          openCurves={onOpenVelocityCurves}
          setReturnCurve={onSetPitchBendReturnCurve}
          showTooltips={showTooltips}
        />
        <AdvancedSliders
          sliderSensitivity={sliderSensitivity}
          setSliderSensitivity={onSetSliderSensitivity}
          LEDMode={LEDMode}
          setLEDMode={onSetLEDMode}
          showTooltips={showTooltips}
        />
        <AdvancedKeyGainButton
          deviceConnected={deviceConnected}
          openKeyGain={onOpenKeyGainMode}
          showTooltips={showTooltips}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deviceConnected: state.device.connected,
    selectedZone: state.editor.selectedZone,
    soloMessageType: state.editor.soloMessageType,
    soloMessageChannel: state.editor.soloMessageChannel,
    keySensitivity: state.currentPreset.device_sensitivity,
    sliderSensitivity: state.currentPreset.slider_sensitivity,
    LEDMode: state.currentPreset.led_mode,
    releaseVelocity: state.currentPreset.release_velocity,
    releaseVelocityCurve: state.currentPreset.release_velocity_table_index,
    // mpeMode: state.currentPreset.mpe_mode,
    pitchBend: state.currentPreset.pitch_bend,
    octave: state.currentPreset.octave,
    transpose: state.currentPreset.transpose,
    keys: state.currentPreset.keys,
    sliders: state.currentPreset.sliders,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOpenKeyGainMode: () => {
      dispatch(openKeyGainMode())
    },
    onSetPitchBendMasterRange: (range) => {
      dispatch(setPitchBendMasterRange(~~range))
    },
    onSetPitchBendMemberRange: (range) => {
      dispatch(setPitchBendMemberRange(~~range))
    },
    onSetPitchBendReturnMode: (mode) => {
      dispatch(setPitchBendReturnMode(~~mode))
    },
    onSetPitchBendReturnTime: (time) => {
      dispatch(setPitchBendReturnTime(parseFloat(time)))
    },
    onSetPitchBendReturnCurve: (curve) => {
      dispatch(setPitchBendReturnCurve(curve))
    },
    onSetOctave: (octave) => {
      dispatch(setOctave(~~octave))
    },
    onSetTranspose: (transpose) => {
      dispatch(setTranspose(~~transpose))
    },
    onSetKeySensitivity: (value) => {
      dispatch(setDeviceSensitivity(~~value))
    },
    onSetSliderSensitivity: (value) => {
      dispatch(setSliderSensitivity(value))
    },
    onSetLEDMode: (value) => {
      dispatch(setLEDMode(value))
    },
    onSetReleaseVelocity: (value) => {
      dispatch(setNoteOffVelocityOn(value))
    },
    onSetReleaseVelocityCurve: (value) => {
      dispatch(setReleaseVelocityCurve(value))
    },
    onOpenVelocityCurves: (opener) => {
      dispatch(openVelocityCurves(opener))
    },
    onSetSoloMessageType: (type) => {
      dispatch(setSoloMessageType(~~type))
    },
    onSetSoloMessageChannel: (channel) => {
      dispatch(setSoloMessageChannel(~~channel))
    },
    onSendSoloMessage: () => {
      dispatch(sendSoloMessage())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSettings)
