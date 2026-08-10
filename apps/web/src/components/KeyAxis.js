// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import Select from 'react-simpler-select'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import clamp from 'lodash.clamp'

import './UI/Select.css'
import './UI/Input.css'

import './KeyAxis.css'

import NumberInput from  './UI/NumberInput'
import Button from  './UI/Button'

import { capitalize } from '../utilities'

import velocityCurves from '../constants/velocityCurves.json'
import tooltips from '../constants/tooltips.json'

const curves = Object.keys(velocityCurves).map(key => ({value: velocityCurves[key], label: capitalize(key)}))

const axes = ['X', 'Y', 'Z']

const axisNames = [
  'X-Axis ( wiggle )',
  'Y-Axis ( slide )',
  'Z-Axis ( press )'
]

const toggleOptions = [
  { label: 'Off', value: 0},
  { label: 'On', value: 1}
]

const axisModeOptions = [
  { label: 'Off', value: 0},
  { label: 'Pitch Bend Absolute', value: 1},
  { label: 'Pitch Bend Relative', value: 2}, // only for X-Axis & Y-Axis
  { label: 'Pitch Bend |x|', value: 9}, // only for X-Axis
  { label: 'CC Absolute', value: 3},
  { label: 'CC Relative', value: 4},
  { label: 'Channel Pressure Absolute', value: 5},
  { label: 'Channel Pressure Relative', value: 6},
  { label: 'Poly Aftertouch Absolute', value: 7 }, // only for Y-Axis & Z-Axis
  { label: 'Poly Aftertouch Relative', value: 8 } // only for Y-Axis & Z-Axis
]

const axisFilters = [
  (o) => !o.label.includes('Poly'), // X-Axis
  (o) => !o.label.includes('|x|'), // Y-Axis
  (o) => !o.label.includes('Bend Relative') && !o.label.includes('|x|')  // Z-Axis
]

class KeyAxis extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      axis,
      zone,
      keys,
      invert,
      setMode,
      mpeMode,
      setCC,
      setRelativeStart,
      setOffset,
      setThreshold,
      setGain,
      openCurves,
      setCurve,
      setZeroOnRelease,
      setKeyAxisInvert,
      tooltip
    } = this.props

    const axisIndex = axes.indexOf(axis)

    return (
      <div className={
        classnames(
          'key-axis',
          `axis-${axis.toLowerCase()}`,
          {'off': keys[axisIndex].mode[zone] === 0 },
          {'has-cc': (keys[axisIndex].mode[zone] === 3 || keys[axisIndex].mode[zone] === 4)}
        ) }>
        <h3
          className="axis-label"
          data-tip={tooltips[`editor-key-${axes[axisIndex].toLowerCase()}-axis`]}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!tooltip}
          >{axisNames[axisIndex]}
        </h3>
        <div
          className="key-axis-mode"
          >
          <label
            className="key-axis-mode-label"
            data-tip={tooltips['editor-key-axis-mode']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Mode
            <Select
              name="key-axis-mode-select"
              value={keys[axisIndex].mode[zone]}
              options={axisModeOptions.filter(axisFilters[axisIndex])}
              onChange={(value) => setMode(axisIndex, value)}
            />
          </label>
          { (
            keys[axisIndex].mode[zone] === 3 ||
            keys[axisIndex].mode[zone] === 4) && <label
            className="key-axis-cc-label"
            data-tip={tooltips['editor-key-axis-cc']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >CC<NumberInput
            name="key-axis-cc"
            min={0} max={127}
            value={keys[axisIndex].cc[zone]}
            onChange={(value) => {
              if(value === null) return
              const ccValue = clamp(value, 0, 127)

              setCC(axisIndex, ccValue)
            }} /></label> }
        </div>
        <div className="key-axis-params">
          <label
            className={ classnames({ "off-label": keys[axisIndex].mode[zone] === 0 }) }
            data-tip={tooltips['editor-key-axis-gain']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >Gain
            <NumberInput
              name="key-axis-gain"
              disabled={ keys[axisIndex].mode[zone] === 0 }
              value={ keys[axisIndex].gain[zone] }
              min={0}
              max={2.00}
              step={0.01}
              precision={2}
              onFocus={ e => e.target.select() }
              onChange={value => {
                if(value === null) return
                const gainValue = clamp(value, 0, 2.00)

                setGain(axisIndex, gainValue.toFixed(2))
              }}
            />
          </label>
          <label
            className={ classnames({
              "off-label": keys[axisIndex].mode[zone] === 0
              })
            }
            data-tip={ tooltips['editor-key-axis-threshold'] }
            data-multiline="true"
            data-place="top"
            data-tip-disable={ !tooltip }
            >Threshold
            <NumberInput
              name="key-axis-threshold"
              disabled={
                keys[axisIndex].mode[zone] === 0
              }
              value={ keys[axisIndex].threshold[zone] }
              min={0} max={127}
              onChange={ value => {
                if(value === null) return
                const thresholdValue = clamp(value, 0, 127)

                setThreshold(axisIndex, thresholdValue)
              }}
            />
          </label>
          { (
            keys[axisIndex].mode[zone] === 2 ||
            keys[axisIndex].mode[zone] === 4 ||
            keys[axisIndex].mode[zone] === 6 ||
            keys[axisIndex].mode[zone] === 8 ||
            keys[axisIndex].mode[zone] === 9) &&
            <label
              className={ classnames({ "off-label": keys[axisIndex].mode[zone] === 0 || keys[axisIndex].mode[zone] === 2 || keys[axisIndex].mode[zone] === 9 }) }
              data-tip={tooltips['editor-key-axis-start']}
              data-multiline="true"
              data-place="top"
              data-tip-disable={!tooltip}
            >Start
            <NumberInput
              name="key-axis-start"
              disabled={keys[axisIndex].mode[zone] === 0 || keys[axisIndex].mode[zone] === 2 || keys[axisIndex].mode[zone] === 9}
              value={ keys[axisIndex].relative_start[zone] }
              min={0} max={127}
              onChange={ value => {
                if(value === null) return
                const startValue = clamp(value, 0, 127)

                setRelativeStart(axisIndex, startValue)
              }}
            />
          </label> }
          { (
            keys[axisIndex].mode[zone] === 0 ||
            keys[axisIndex].mode[zone] === 1 ||
            keys[axisIndex].mode[zone] === 3 ||
            keys[axisIndex].mode[zone] === 5 ||
            keys[axisIndex].mode[zone] === 7) &&
            <label
              className={ classnames({ "off-label": keys[axisIndex].mode[zone] === 0 || keys[axisIndex].mode[zone] === 1 }) }
              data-tip={tooltips['editor-key-axis-offset']}
              data-multiline="true"
              data-place="top"
              data-tip-disable={!tooltip}
            >Offset
            <NumberInput
              name="key-axis-offset"
              disabled={keys[axisIndex].mode[zone] === 0 || keys[axisIndex].mode[zone] === 1}
              value={ keys[axisIndex].offset[zone] }
              min={-127} max={255}
              onChange={ value => {
                if(value === null) return
                const offsetValue = clamp(value, -127, 127)

                setOffset(axisIndex, offsetValue)
              }}
            />
          </label> }
        </div>
        <div className='key-axis-curves-zero'>
          <label
            className={ classnames("key-axis-curve-label", {"off-label": keys[axisIndex].mode[zone] === 0 }) }
            data-tip={tooltips['editor-key-axis-curve']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Curve
            <Select
              name="key-axis-curve-select"
              value={keys[axisIndex].curve[zone]}
              options={curves}
              onChange={(value) => {
                if(value === '127'){
                  openCurves(`keyAxis-${axisIndex}`)
                } else {
                  setCurve(axisIndex, value)
                }
              }}
            />
          </label>
          {( axisIndex > 0 ) && <label 
            className={classnames('key-axis-invert', 
            { "off-label": keys[axisIndex].mode[zone] === 0 }) }
            >
            Invert 
            <Button
              name={invert && invert[zone] ? "On" : "Off"}
              data-tip={tooltips['editor-key-axis-invert']}
              data-multiline="true"
              data-place="top"
              data-tip-disable={!tooltip}
              toggle={invert && ~~!invert[zone]}
              onClick={() => {
                if (invert) setKeyAxisInvert(axisIndex, ~~!invert[zone])
              }}
          />
          </label> }
            
            
          <label
            className={ classnames(
              "key-axis-zero-on-release-label",
              { "off-label": keys[axisIndex].mode[zone] === 0 || mpeMode === 0}
            )}
            data-tip={tooltips['editor-key-axis-zero-on-release']}
            data-multiline="true"
            data-place="top"
            data-tip-disable={!tooltip}
            >
            Release Zero
            <Select
              name="key-axis-zero-on-release-select"
              value={keys[axisIndex].zero_on_release[zone]}
              options={toggleOptions}
              onChange={(mode) => setZeroOnRelease(axisIndex, mode)}
            />
          </label>
        </div>
      </div>
    )
  }
}

export default KeyAxis
