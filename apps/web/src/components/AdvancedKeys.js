// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import Select from 'react-simpler-select'
import clamp from 'lodash.clamp'

import NumberInput from './UI/NumberInput'
import Button from './UI/Button'

import './UI/Select.css'
import './UI/Input.css'
import './UI/Button.css'

import { capitalize } from '../utilities'

import velocityCurves from '../constants/velocityCurves.json'
import tooltips from '../constants/tooltips.json'

const curves = Object.keys(velocityCurves).map(key => ({value: velocityCurves[key], label: capitalize(key)}))

const soloOptions = [
  { label: 'X-Axis', value: 0},
  { label: 'Y-Axis', value: 1},
  { label: 'Z-Axis', value: 2},
  { label: 'Note On/Off', value: 3}
]

const releaseVelocityOptions = [
  { label: 'On', value: 255},
  { label: 'Off 0', value: 0},
  { label: 'Off 64', value: 64},
  { label: 'Off 127', value: 127}
]

const octaveOptionsFull = [
  { label: '-2', value: 0},
  { label: '-1', value: 1},
  { label: '0', value: 2},
  { label: '1', value: 3},
  { label: '2', value: 4},
  { label: '3', value: 5},
  { label: '4', value: 6}
]
const octaveOptions4 = [
  { label: '0', value: 2},
  { label: '1', value: 3},
  { label: '2', value: 4},
  { label: '3', value: 5}
]

const AdvancedKeys = (props) => {
  const {
    zone,
    octave,
    transpose,
    sliders,
    soloMessageType,
    soloMessageChannel,
    keySensitivity,
    releaseVelocity,
    releaseVelocityCurve,
    setOctave,
    setTranspose,
    setSoloMessageType,
    setSoloMessageChannel,
    setKeySensitivity,
    setReleaseVelocity,
    setReleaseVelocityCurve,
    openCurves,
    sendSoloMessage,
    deviceConnected,
    showTooltips
  } = props

  // set octave range conditional
  const hasOctave4 = sliders.some(slider => slider.mode === 3),
        hasOctave7 = sliders.some(slider => slider.mode === 4)

  return (
    <div className="grid-group keys">
      <h3>Keys</h3>
      <div className="grid-item transpose">
        <label
          className="transpose-label"
          data-tip={tooltips['editor-advanced-transpose']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Transpose<NumberInput
          name="transpose"
          min={0} max={12}
          format={function addSeconds(value) {
              return value + ' semitones';
          }}
          value={transpose[zone]}
          onChange={(value) => {
            if(value === null) return
            const transposeValue = clamp(value, 0, 12)

            setTranspose(transposeValue)
          }} />
        </label>
      </div>
      <div className="grid-item octave">
        <label
          className="octave-label"
          data-tip={tooltips['editor-advanced-octave']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Base Octave
          <Select
            name="octave"
            value={octave[zone]}
            options={ hasOctave4 && !hasOctave7 ? octaveOptions4: octaveOptionsFull }
            onChange={(value) => {
              setOctave(value)
            }}
          />
        </label>
      </div>
      <div className="grid-item release-velocity">
        <label
          className="release-velocity-label"
          data-tip={tooltips['editor-advanced-release-velocity']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Release Velocity<Select
            name="release-velocity-select"
            value={releaseVelocity[zone]}
            options={releaseVelocityOptions}
            onChange={(value) => {
              setReleaseVelocity(value)
            }}
          />
        </label>
        <label
          className="release-velocity-curve-label"
          data-tip={tooltips['editor-advanced-release-velocity-curve']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Release Curve<Select
            name="release-velocity-curve-select"
            value={releaseVelocityCurve[zone]}
            options={curves}
            onChange={(value) => {
              if(value === '127') {
                openCurves('releaseVelocity')
              } else {
                setReleaseVelocityCurve(value)
              }
            }}
          />
        </label>
      </div>
      <div className="grid-item key-sensitivity">
        <label
          className="key-sensitivity-label"
          data-tip={tooltips['editor-advanced-key-threshold']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >All Key Threshold<NumberInput
          name="key-sensitivity"
          min={0} max={254}
          value={keySensitivity}
          onChange={(value) => {
            if(value === null) return
            const sensitivityValue = clamp(value, 0, 254)

            setKeySensitivity(sensitivityValue)
          }} />
        </label>
      </div>
      <div className="mapping-assistant grid-group-mapping-assistant">
        <label
          className="mapping-assistant-message-type-label"
          data-tip={tooltips['editor-advanced-mapping-assistant-type']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          ><span>Mapping Assistant</span> Message Type
        <Select
          name="mapping-assistant-type-select"
          value={soloMessageType}
          options={soloOptions}
          onChange={(value) => {
            setSoloMessageType(value)
          }}
        />
        </label>
        <label
          className="mapping-assistant-channel-label"
          data-tip={tooltips['editor-advanced-mapping-assistant-channel']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Channel
        <NumberInput
        name="mapping-assistant-channel"
        min={1} max={16}
        value={soloMessageChannel}
        onChange={(value) => {
          if(value === null) return

          const messageChannel = clamp(value, 1, 16)

          setSoloMessageChannel(messageChannel)
        }} />
        </label>
        <label
          className="mapping-assistant-send-label"
          data-tip={tooltips['editor-advanced-mapping-assistant-send']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!showTooltips}
          >Message Send
        <Button
          name="Send"
          disabled={!deviceConnected}
          onClick={ () => sendSoloMessage() }
        />
        </label>
      </div>
    </div>
  )
}

export default AdvancedKeys
