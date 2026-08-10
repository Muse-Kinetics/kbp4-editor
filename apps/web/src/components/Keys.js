// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import KeyAxis from './KeyAxis'
import KeyZones from './KeyZones'

import {
  setMIDIDeviceChannel,
  setKeyAxisMode,
  setKeyAxisCC,
  setKeyAxisOffset,
  setKeyAxisRelativeStart,
  setKeyAxisThreshold,
  setKeyAxisGain,
  setKeyAxisCurve,
  setKeyAxisZeroOnRelease,
  setKeyAxisInvert,
  openVelocityCurves
} from '../actions/'

class Keys extends Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      selectedZone,
      keys,
      mpeMode,
      deviceChannels,
      onSetMIDIDeviceChannel,
      onSetKeyAxisMode,
      onSetKeyAxisCC,
      onSetKeyAxisRelativeStart,
      onSetKeyAxisOffset,
      onSetKeyAxisThreshold,
      onSetKeyAxisGain,
      onOpenVelocityCurves,
      onSetKeyAxisCurve,
      onSetKeyAxisZeroOnRelease,
      onSetKeyAxisInvert,
      showTooltips
    } = this.props

    return (
      <div className={classnames("key-axes-zones", {"lower-zone-active": this.props.selectedZone === 0, "upper-zone-active": this.props.selectedZone === 1})}>
        {
          ['X', 'Y', 'Z'].map((axis, index) => {
            return (
              <KeyAxis
                key={index}
                zone={selectedZone}
                axis={axis}
                keys={keys}
                invert={this.props[`${axis.toLowerCase()}_axis_invert`]}
                mpeMode={mpeMode}
                setMode={onSetKeyAxisMode}
                setCC={onSetKeyAxisCC}
                setRelativeStart={onSetKeyAxisRelativeStart}
                setOffset={onSetKeyAxisOffset}
                setThreshold={onSetKeyAxisThreshold}
                setGain={onSetKeyAxisGain}
                openCurves={onOpenVelocityCurves}
                setCurve={onSetKeyAxisCurve}
                setZeroOnRelease={onSetKeyAxisZeroOnRelease}
                setKeyAxisInvert={onSetKeyAxisInvert}
                tooltip={showTooltips}
              />
            )
          })
        }

        <KeyZones
          mpeMode={mpeMode}
          zone={selectedZone}
          setSplit={() => {}}
          setChannel={onSetMIDIDeviceChannel}
          deviceChannels={deviceChannels}
          tooltip={showTooltips}
          />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedZone: state.editor.selectedZone,
    keys: state.currentPreset.keys,
    y_axis_invert: state.currentPreset.y_axis_invert,
    z_axis_invert: state.currentPreset.z_axis_invert,
    mpeMode: state.currentPreset.mpe_mode,
    deviceChannels: state.currentPreset.device_channels,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetMIDIDeviceChannel: (channel) => {
      dispatch(setMIDIDeviceChannel(channel))
    },
    onSetKeyAxisMode: (axis, mode) => {
      dispatch(setKeyAxisMode(axis, ~~mode))
    },
    onSetKeyAxisCC: (axis, cc) => {
      dispatch(setKeyAxisCC(axis, ~~cc))
    },
    onSetKeyAxisRelativeStart: (axis, start) => {
      dispatch(setKeyAxisRelativeStart(axis, ~~start))
    },
    onSetKeyAxisOffset: (axis, offset) => {
      dispatch(setKeyAxisOffset(axis, ~~offset))
    },
    onSetKeyAxisThreshold: (axis, threshold) => {
      dispatch(setKeyAxisThreshold(axis, ~~threshold))
    },
    onSetKeyAxisGain: (axis, gain) => {
      dispatch(setKeyAxisGain(axis, gain))
    },
    onSetKeyAxisCurve: (axis, index) => {
      dispatch(setKeyAxisCurve(axis, index))
    },
    onOpenVelocityCurves: (opener) => {
      dispatch(openVelocityCurves(opener))
    },
    onSetKeyAxisZeroOnRelease: (axis, mode) => {
      dispatch(setKeyAxisZeroOnRelease(axis, mode))
    },
    onSetKeyAxisInvert: (axis, mode) => {
      dispatch(setKeyAxisInvert(axis, mode))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Keys)
