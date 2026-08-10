// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-simpler-select'
import classnames from 'classnames'
import debounce from 'lodash.debounce'

import './UI/Select.css'
import './UI/Input.css'
import './KeyZones.css'

import NumberInput from  './UI/NumberInput'

import { capitalize } from '../utilities'

import velocityCurves from '../constants/velocityCurves.json'
import tooltips from '../constants/tooltips.json'

import {
  setZoneSplitKey,
  setMPEMode,
  setMIDIDeviceChannel,
  setMPEDeviceChannel,
  openVelocityCurves,
  setNoteOnVelocityCurve
} from '../actions/'

const toggleOptions = [
  { label: 'Enabled', value: 1},
  { label: 'Disabled', value: 0}
]

const curves = Object.keys(velocityCurves).map(key => ({value: velocityCurves[key], label: capitalize(key)}))

const KeyZones = (props) => {
  const {
    selectedZone,
    mpeMode,
    MPEChannels,
    deviceChannels,
    splitKey,
    noteOnVelocityTable,
    tooltip,
    onSetSplitKey,
    onSetMPEMode,
    onSetDeviceChannel,
    onOpenVelocityCurves,
    onSetNoteOnVelocityCurve
  } = props

  return (
    <div className="zones">
      <h3 className={ classnames("zone-label",{mpeoff:!mpeMode}) }
        data-tip={tooltips['editor-zones']}
        data-multiline="true"
        data-place="top"
        data-tip-disable={!tooltip}
      >{mpeMode ? 'MPE' : 'MIDI Channel'} Zones</h3>
      { false && <div className={
        classnames(
        "zone-splits",
        {upper:splitKey === 0},
        {lower:splitKey === 48}
      )}
        data-tip={tooltips['editor-zone-split-key']}
        data-multiline="true"
        data-place="top"
        data-tip-disable={!tooltip}
      >
        <label>Zones Split Key</label>
        <NumberInput
          name="zone-split-point"
          value={ splitKey + 1}
          min={1} max={49}
          onChange={debounce((key) => {
            if(key < 0 || key === null) return
            onSetSplitKey(key > 49 ? 49 : key)
          }, 5)}
        />
      </div> }
      <div
        className={classnames('mpe-mode')}
        data-tip={tooltips['editor-advanced-mpe']}
        data-multiline="true"
        data-place="top"
        data-tip-disable={!tooltip}
        >
        <label>MPE Mode</label>
        <Select
          name="mpe-mode-select"
          value={mpeMode}
          options={toggleOptions}
          onChange={(value) => onSetMPEMode(value)}
        />
      </div>
      <div className="zone-settings">
        <div className={
          classnames(
            'zone-channels',
            { 'error' : !mpeMode && deviceChannels[selectedZone] === deviceChannels[+!selectedZone] }
          )}
          data-tip={tooltips[`editor-zone-${mpeMode ? 'channels' : 'channel'}`]}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!tooltip}
        >
          <label
            >{mpeMode ? 'Number of Channels' : 'Zone Channel'}
          </label>
          <NumberInput
            name={ classnames(`zone-channels-${ selectedZone === 0 ? 'lower' : 'upper'}`) }
            value={ mpeMode ? MPEChannels[selectedZone] : deviceChannels[selectedZone] + 1 }
            min={1} max={ () => mpeMode ? Math.abs(MPEChannels[+!selectedZone] - ((splitKey === 0 || splitKey === 48) ? 15 : 14)) : 16 }
            onChange={ value => {
              if(value < 0 || value === null) return
              onSetDeviceChannel(value > 16 ? 16 : value, mpeMode)
            }}
          />
        </div>
        <div
          className={classnames('zone-curves', `zone-curves-${ selectedZone === 0 ? 'lower' : 'upper'}`)}
          data-tip={tooltips['editor-zone-curve']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!tooltip}
          >
          <label>Velocity Curves</label>
          <Select
            name="zone-curve"
            value={ noteOnVelocityTable[selectedZone] }
            options={curves}
            onChange={(value) => {
              if(value === '127') {
                onOpenVelocityCurves('noteOnVelocity')
              } else {
                onSetNoteOnVelocityCurve(value)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedZone: state.editor.selectedZone,
    splitKey: state.currentPreset.zone_split_key_num,
    mpeMode: state.currentPreset.mpe_mode,
    MPEChannels: state.currentPreset.number_of_MPE_member_channels,
    deviceChannels: state.currentPreset.device_channels,
    noteOnVelocityTable: state.currentPreset.note_on_velocity_table_index,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetSplitKey: (key) => {
      dispatch(setZoneSplitKey((~~key - 1 < 0) ? 0 : ~~key - 1))
    },
    onSetMPEMode: (mode) => {
      dispatch(setMPEMode(~~mode))
    },
    onSetDeviceChannel: (channel, mode) => {
      dispatch(mode ? setMPEDeviceChannel(~~channel) : setMIDIDeviceChannel((~~channel - 1 < 0) ? 0 : ~~channel - 1))
    },
    onSetNoteOnVelocityCurve: (index) => {
      dispatch(setNoteOnVelocityCurve(~~index))
    },
    onOpenVelocityCurves: (opener) => {
      dispatch(openVelocityCurves(opener))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyZones)
