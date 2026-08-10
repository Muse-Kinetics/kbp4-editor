// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
// import Nexus from 'nexusui'
import Select from 'react-simpler-select'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import isEqual from 'lodash.isequal'
import clamp from 'lodash.clamp'
import debounce from 'lodash.debounce'

import { getKeySensor } from '../utilities'

import './UI/Input.css'
import './UI/Select.css'
import './KeyGain.css'

import Button from './UI/Button'
import NumberInput from  './UI/NumberInput'

import KeyGainKeySensorSVG from './KeyGainKeySensorSVG'
import KeyOctavesSVG from './KeyOctavesSVG'

import colorPalettes from '../constants/colorPalettes.json'
import tooltips from '../constants/tooltips.json'

import {
  closeKeyGainMode,
  requestSensorBanks,
  setSensorEditMode,
  sendAuditionSensor,
  setOverrideSensor,
  removeOverrideSensor,
  sendWriteSensorBanks,
  sendRecalculateSensorData,
  sendEraseSensorBank
} from '../actions'

// color palette
const palette = colorPalettes['plasma']

const editModes = [
  { label: 'Single Sensor', value: 0},
  { label: 'Entire Key', value: 1},
  { label: 'Entire Octave', value: 2}
]

class KeyGain extends Component {
  state = {
    modalIsOpen: false,
    octaveReady: false,
    selectedOctave: 0,
    selectedKey: -1,
    selectedKeyOn: -1,
    selectedKeyOff: -1,
    selectedKeyDamp: -1,
    selectedSensorSide: -1,
    selectedSensor: -1,
    selectedSensorGain: -1,
    selectedSensorMax: -1,
    initialOverrides: {},
    initialClickedSensors: {},
    currentParam: ''
  }

  // render flags
  shouldUpdateCheck = true
  shouldUpdateFlag = 0
  // used for color setting
  selectedGangBank = '0|0'

  shouldComponentUpdate(nextProps, nextState) {
    if(this.shouldUpdateCheck && this.state.modalIsOpen) {
      // console.count('sensor')
      if(this.shouldUpdateFlag < 1296) { // total number of sensors
        this.shouldUpdateFlag++
        // do not render during sensor data load
        return false
      }
      // sensors loaded; resume rendering
      this.shouldUpdateCheck = false
      this.setState({initialOverrides: this.props.keySensors.overrides})
      // reset edit mode on open
      this.props.onSetSensorEditMode(0)

      // set initial colors
      setSensorColors(palette, this.props.keySensors.ganged_2[0], this.state.selectedOctave)

      const octave = 0, keyIndex = 0, keySide = 0, keySensor = 0
      const keyOn = this.props.keySensors.ganged_12[0][octave][keyIndex][0][0],
            keyDamp = this.props.keySensors.ganged_12[1][octave][keyIndex][0][0],
            keyOff = this.props.keySensors.ganged_12[1][octave][keyIndex][1][0],
            sensorGain = this.props.keySensors.ganged_2[0][octave][keyIndex][keySide][keySensor],
            sensorMax = this.props.keySensors.ganged_2[1][octave][keyIndex][keySide][keySensor]

      this.setState({
        selectedKey: keyIndex,
        selectedKeyOn: keyOn,
        selectedKeyOff: keyOff,
        selectedKeyDamp: keyDamp,
        selectedSensorSide: keySide,
        selectedSensor: keySensor,
        selectedSensorGain: sensorGain,
        selectedSensorMax: sensorMax,
        currentParam: '0|0',
        octaveReady: true
      })

      // add active class to init items
      const initItems = ['key_sensors_0', 'key_0', 'sensor_K0_L0']
      initItems.forEach(item => document.querySelector(`#${item}`).classList.add('active'))

      return true
    } else {
      // regular render: pre-modal open
      return true
    }
  }

  updateOverrides = () => {
    const {
      overrides
    } = this.props.keySensors
    const {
      initialOverrides,
      initialClickedSensors
    } = this.state

    // if new value is initial value, remove from overrides
    Object.keys(overrides).forEach((overrideID) => {
      const isNewSessionSensor = !!initialClickedSensors[overrideID]
      const isInitialValue = overrides[overrideID] === initialClickedSensors[overrideID]
      const notInitialOverride = !!!initialOverrides[overrideID]

      if(isNewSessionSensor && isInitialValue && notInitialOverride) {
        this.props.onRemoveOverrideSensor(overrideID)
      }
    })
  }
/*
  revertSensorStateAndOverrides = (overrides) => {
    this.props.onRevertSensorState({...overrides})
  }
*/
  afterOpenModal = () => {
    this.shouldUpdateCheck = true
    this.shouldUpdateFlag = 0

    this.setState({modalIsOpen: true});

    this.props.onGetSensorData()

    ReactTooltip.rebuild()
  }

  handleCloseModal = () => {
    this.setState({
      modalIsOpen: false,
      selectedOctave: 0,
      selectedKey: -1,
      selectedKeyOn: -1,
      selectedKeyOff: -1,
      selectedKeyDamp: -1,
      selectedSensorSide: -1,
      selectedSensor: 0,
      selectedSensorGain: -1,
      selectedSensorMax: -1,
      initialOverrides: {},
      initialClickedSensors: {},
      octaveReady: false,
      currentParam: ''
    })

    this.props.onSendRecalculateSensors()
    this.props.onCloseKeyGainMode()
  }

  handleClick = (e) => {
    const target = e.target.id

    if(/^key_([0-9])+/.test(target)) {
      // clear active class
      clearActiveKey()

      const keyIndex = Number(target.replace('key_',''))

      // add active class
      document.querySelector(`#key_sensors_${keyIndex}`).classList.add('active')
      document.querySelector(`#${target}`).classList.add('active')

      const keyOn = this.props.keySensors.ganged_12[0][this.state.selectedOctave][this.state.selectedKey === -1 ? 0 : this.state.selectedKey][0][0] || 0

      this.setState({
        selectedKey: keyIndex,
        selectedKeyOn: keyOn,
        selectedSensorSide: 0,
        selectedSensor: -1
      })

      // set initialOverrides for reverting
      if(Object.keys(this.state.initialOverrides).length === 0 && this.props.keySensors.sensorsLoaded) this.setState({initialOverrides: this.props.keySensors.overrides})
    } else if(target.includes('sensor_')) {
      // clear active class
      clearActiveKey()
      // add active class
      document.querySelector(`#${target}`).classList.add('active')

      const {
        key: keyIndex,
        side: keySide,
        sensor: keySensor
      } = getKeySensor(target)

      const octave = this.state.selectedOctave

      const keyOn = this.props.keySensors.ganged_12[0][octave][keyIndex][0][0],
            keyDamp = this.props.keySensors.ganged_12[1][octave][keyIndex][0][0],
            keyOff = this.props.keySensors.ganged_12[1][octave][keyIndex][1][0],
            sensorGain = this.props.keySensors.ganged_2[0][octave][keyIndex][keySide][keySensor],
            sensorMax = this.props.keySensors.ganged_2[1][octave][keyIndex][keySide][keySensor]

      this.setState({
        selectedKey: keyIndex,
        selectedKeyOn: keyOn,
        selectedKeyOff: keyOff,
        selectedKeyDamp: keyDamp,
        selectedSensorSide: Number(keySide),
        selectedSensor: Number(keySensor),
        selectedSensorGain: sensorGain,
        selectedSensorMax: sensorMax
      })

      if(keyIndex) {
        document.querySelector(`#key_sensors_${keyIndex}`).classList.add('active')
        document.querySelector(`#key_${keyIndex}`).classList.add('active')
      }

      // set initialOverrides for reverting
      if(Object.keys(this.state.initialOverrides).length === 0 && this.props.keySensors.sensorsLoaded) this.setState({initialOverrides: this.props.keySensors.overrides})
    } else {
      // clear active class
      clearActiveKey()

      this.setState({
        selectedKey: -1,
        selectedSensorSide: -1,
        selectedSensor: -1
      })
    }
	}

/*
  setSensorState = () => {
    this.setState({
      selectedKey: ~~keySensor.key,
      selectedKeyOn: keyOn,
      selectedSensorSide: ~~keySensor.side,
      selectedSensor: ~~keySensor.sensor,
      selectedSensorGain: sensorGain,
      selectedSensorMax: sensorMax
    }, function() {
      // can probably remove one of these
      if(this.state.selectedKey) document.querySelector(`#key_sensors_${keySensor.key}`).classList.add('active')
      if(this.state.selectedKey) document.querySelector(`#key_${keySensor.key}`).classList.add('active')
    })
  }

  setKeySensorState = () => {

  }

  setMissedSensorState = () => {
    this.setState({
      selectedKey: -1,
      selectedSensorSide: -1,
      selectedSensor: -1
    })
  }
*/
  keyOctaveSetState = (octave) => {
    const [gang,bank] = this.selectedGangBank.split('|').map(Number)

    if(gang === 1) {
      // do we need to set different sides here?
      setKeySensorsColors(palette, this.props.keySensors['ganged_12'][bank], octave, 0)
    } else {
      setSensorColors(palette, this.props.keySensors['ganged_2'][bank], octave)
    }

    this.setState({
      selectedOctave: (octave) ? Number(octave) : 0
    })
  }

  render() {
    const {
      deviceConnected,
      keyGainModeOpen,
      sensorEditMode,
      onSetSensorEditMode,
      onAuditionSensor,
      onSetOverrideSensor,
      onWriteSensorBanks,
      showTooltips
    } = this.props

    return (
      <div className='key-gain-modal'>
        <ReactModal
          isOpen={keyGainModeOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={false}
          className="react-modal"
          overlayClassName="react-modal-overlay"
          contentLabel="Sensor Adjustment"
        >
          <div className={ classnames('key-gain-editor', {'ready': this.state.modalIsOpen && this.props.keySensors.sensorsLoaded }) }>
            <div
              className={classnames('key-gain-octave', {'octave-ready': this.state.octaveReady})}
              data-tip={tooltips['editor-sensor-adjustment-sensors']}
              data-multiline="true"
              data-place="top"
              data-tip-disable={!showTooltips}
              >
              <KeyGainKeySensorSVG onClick={ this.handleClick }/>
            </div>
            <div className='key-gain-settings'>
              <div className='key-gain-status'>
                <h4>Octave</h4>
                <Button
                  name='X'
                  onClick={() => {
                    this.handleCloseModal()
                  }}
                  data-tip={tooltips['editor-sensor-adjustment-close']}
                  data-multiline="true"
                  data-place="right"
                  data-tip-disable={!showTooltips}
                />
              <KeyOctavesSVG octave={ this.state.selectedOctave } octaveSetState={this.keyOctaveSetState} tooltips={showTooltips} />
                { (this.state.selectedKey === -1) ? <p className="key-gain-status-prompt">Select a Key Sensor</p> : '' }
                { (this.state.selectedKey !== -1) ? <p className="key-gain-key">Key: {this.state.selectedKey}</p> : '' }
                { (this.state.selectedSensor !== -1 && this.state.selectedSensorSide !== -1)
                  ? <p className="key-gain-sensor">Sensor: {(this.state.selectedSensorSide === 0 ? 'L' : 'R') + this.state.selectedSensor}</p>
                  : ''
                }
              </div>
              <div
                className="color-legend"
                data-tip={tooltips['editor-sensor-adjustment-legend']}
                data-multiline="true"
                data-place="left"
                data-tip-disable={!showTooltips}
                ></div>
              <div className="sensor-edit-mode">
                <label
                  className="sensor-edit-mode-label"
                  data-tip={tooltips['editor-sensor-adjustment-edit-mode']}
                  data-multiline="true"
                  data-place="left"
                  data-tip-disable={!showTooltips}
                  >
                  Edit Mode
                  <Select
                    name="sensor-edit-mode-select"
                    value={sensorEditMode}
                    options={
                      this.state.currentParam.split('|')[0] === "0"
                      ? editModes
                      : editModes.slice(1)
                    }
                    onChange={(mode) => onSetSensorEditMode(mode)}
                  />
                </label>
              </div>
              <div className='key-gain-params'>
                <div className={ classnames('param-group sensor', {'disabled': this.state.selectedSensor === -1 }) }>
                  <h4>Sensor</h4>
                  <div
                    className={ classnames('param sensor-gain', {'active': this.state.currentParam === '0|0'}) }
                    data-tip={tooltips['editor-sensor-adjustment-gain']}
                    data-multiline="true"
                    data-place="left"
                    data-tip-disable={!showTooltips}
                    >
                    <label>Gain</label>
                    <NumberInput
                      name={ classnames(`sensorgain`) }
                      value={ this.state.selectedSensorGain }
                      min={ 0 } max={ 100 }
                      disabled={ this.state.selectedSensor === -1 }
                      onChange={ debounce(value => {
                        if(value === null) return

                        const sensorGain = clamp(value, 0, 100)

                        // set state and check revertable
                        this.setState({selectedSensorGain: sensorGain}, () => {
                          // update overrides and send audition message
                          const gangBank = '0|0',
                                sensorData = [
                                  this.state.selectedOctave,
                                  this.state.selectedKey,
                                  this.state.selectedSensorSide,
                                  this.state.selectedSensor,
                                  sensorGain
                                ].join(',')

                          onSetOverrideSensor(gangBank, sensorData, sensorEditMode)
                          onAuditionSensor(gangBank, sensorData, sensorEditMode)

                          setTimeout(() => { // timout to account for delay in setting state
                            // update colors
                            setSensorColors(palette, this.props.keySensors.ganged_2[0], this.state.selectedOctave)
                            // update overrides
                            this.updateOverrides()
                          }, 100)
                        })
                      }, 100)}
                      onFocus={
                        (e) => {
                          e.target.select()
                          // ganged_2, bank 0
                          const sensorID = `0,0,${this.state.selectedOctave},${this.state.selectedKey},${this.state.selectedSensorSide},${this.state.selectedSensor}`

                          // used for setting colors on octave change
                          this.selectedGangBank = '0|0'
                          // used to set active on .param
                          this.setState({currentParam: '0|0'})
                          // set colors
                          setSensorColors(palette, this.props.keySensors.ganged_2[0], this.state.selectedOctave)
                          // if sensor is already in clicked sensors don't add it again

                          // set sensor edit mode to sensor
                          // onSetSensorEditMode(0)

                          if(this.state.initialClickedSensors[sensorID]) return

                          this.setState((prevState) => {
                            return {
                              initialClickedSensors: {
                                ...prevState.initialClickedSensors,
                                [sensorID]: Number(e.target.value)
                              },
                              octaveReady: true
                            }
                          })
                        }
                      }
                    />
                  </div>
                  <div
                    className={ classnames('param sensor-max', {'active': this.state.currentParam === '0|1'}) }
                    data-tip={tooltips['editor-sensor-adjustment-max']}
                    data-multiline="true"
                    data-place="left"
                    data-tip-disable={!showTooltips}
                    >
                    <label>Max</label>
                    <NumberInput
                      name={ classnames(`sensormax`) }
                      value={ this.state.selectedSensorMax }
                      min={ 0 } max={ 254 }
                      disabled={ this.state.selectedSensor === -1 }
                      onChange={ value => {
                        if(value === null) return

                        const sensorMax = clamp(value, 0, 254)

                        // set state and check revertable
                        this.setState({selectedSensorMax: sensorMax}, () => {
                          // update overrides and send audition message
                          const gangBank = '0|1',
                                sensorData = [
                                  this.state.selectedOctave,
                                  this.state.selectedKey,
                                  this.state.selectedSensorSide,
                                  this.state.selectedSensor,
                                  sensorMax
                                ].join(',')

                          onSetOverrideSensor(gangBank, sensorData, sensorEditMode)
                          onAuditionSensor(gangBank, sensorData, sensorEditMode)

                          setTimeout(() => { // timout to account for delay in setting state
                            // update colors
                            setSensorColors(palette, this.props.keySensors.ganged_2[1], this.state.selectedOctave)
                            // update overrides
                            this.updateOverrides()
                          }, 100)


                        })
                      }}
                      onFocus={
                        (e) => {
                          e.target.select()
                          // ganged_2, bank 1
                          const sensorID = `0,1,${this.state.selectedOctave},${this.state.selectedKey},${this.state.selectedSensorSide},${this.state.selectedSensor}`
                          // used for setting colors on octave change
                          this.selectedGangBank = '0|1'
                          // used to set active on .param
                          this.setState({currentParam: '0|1'})
                          // update colors
                          setSensorColors(palette, this.props.keySensors.ganged_2[1], this.state.selectedOctave)

                          // set sensor edit mode to sensor
                          // onSetSensorEditMode(0)

                          if(this.state.initialClickedSensors[sensorID]) return

                          this.setState((prevState) => {
                            return {
                              initialClickedSensors: {
                                ...prevState.initialClickedSensors,
                                [sensorID]: Number(e.target.value)
                              },
                              octaveReady: true
                            }
                          })
                        }
                      }
                    />
                  </div>
                </div>
                <div className={ classnames('param-group key', {'disabled': this.state.selectedKey === -1}) }>
                  <h4>Key <span>( Thresholds )</span></h4>
                  <div
                    className={ classnames('param key-gain', {'active': this.state.currentParam === '1|0|0'}) }
                    data-tip={tooltips['editor-sensor-adjustment-on']}
                    data-multiline="true"
                    data-place="left"
                    data-tip-disable={!showTooltips}
                    >
                    <label>On</label>
                    <NumberInput
                      name={ classnames(`keyonthreshold`) }
                      value={ this.state.selectedKeyOn }
                      min={ 0 } max={ 254 }
                      disabled={ this.state.selectedKey === -1 }
                      onChange={ value => {
                        if(value === null) return

                        const keyOnThreshold = clamp(value, 0, 254)

                        // update state and check revertable
                        this.setState({selectedKeyOn: keyOnThreshold}, () => {
                          // update overrides and send audition message
                          const gangBank = '1|0',
                                sensorData = [
                                  this.state.selectedOctave,
                                  this.state.selectedKey,
                                  0,
                                  0,
                                  keyOnThreshold
                                ].join(',')

                          onSetOverrideSensor(gangBank, sensorData, sensorEditMode < 2 ? 0 : sensorEditMode)
                          onAuditionSensor(gangBank, sensorData, sensorEditMode < 2 ? 0 : sensorEditMode)

                          setTimeout(() => { // timout to account for delay in setting state
                            // update colors
                            setKeySensorsColors(palette, this.props.keySensors.ganged_12[0], this.state.selectedOctave, 0)
                            // update overrides
                            this.updateOverrides()
                          }, 100)
                        })
                      }}
                      onFocus={
                        (e) => {
                          e.target.select()
                          // ganged 12, bank 0
                          const sensorID = `1,0,${this.state.selectedOctave},${this.state.selectedKey},${0},${0}`
                          // used for setting colors on octave change
                          this.selectedGangBank = '1|0|0'
                          // used to set active on .param
                          this.setState({currentParam: '1|0|0'})

                          // update colors
                          setKeySensorsColors(palette, this.props.keySensors.ganged_12[0], this.state.selectedOctave, 0)

                          // set sensor edit mode to key
                          if(Number(sensorEditMode) === 0) onSetSensorEditMode(1)

                          if(this.state.initialClickedSensors[sensorID]) return

                          this.setState((prevState) => {
                            return {
                              initialClickedSensors: {
                                ...prevState.initialClickedSensors,
                                [sensorID]: Number(e.target.value)
                              },
                              octaveReady: true
                            }
                          })
                        }
                      }
                    />
                  </div>
                  <div
                    className={ classnames('param key-gain', {'active': this.state.currentParam === '1|1|0'}) }
                    data-tip={tooltips['editor-sensor-adjustment-damp']}
                    data-multiline="true"
                    data-place="left"
                    data-tip-disable={!showTooltips}
                    >
                    <label>Damping</label>
                    <NumberInput
                      name={ classnames(`keydampinthreshold`) }
                      value={ this.state.selectedKeyDamp }
                      min={ 0 } max={ 254 }
                      disabled={ this.state.selectedKey === -1 }
                      onChange={ value => {
                        if(value === null) return

                        const keyDampThreshold = clamp(value, 0, 254)

                        // update state and check revertable
                        this.setState({selectedKeyDamp: keyDampThreshold}, () => {
                          // update overrides and send audition message
                          const gangBank = '1|1',
                                sensorData = [
                                  this.state.selectedOctave,
                                  this.state.selectedKey,
                                  0,
                                  0,
                                  keyDampThreshold
                                ].join(',')

                          onSetOverrideSensor(gangBank, sensorData, sensorEditMode < 2 ? 0 : sensorEditMode)
                          onAuditionSensor(gangBank, sensorData, sensorEditMode < 2 ? 0 : sensorEditMode)

                          setTimeout(() => { // timout to account for delay in setting state
                            // update colors
                            setKeySensorsColors(palette, this.props.keySensors.ganged_12[1], this.state.selectedOctave, 0)
                            // update overrides
                            this.updateOverrides()
                          }, 100)
                        })
                      }}
                      onFocus={
                        (e) => {
                          e.target.select()
                          // ganged 12, bank 0
                          const sensorID = `1,1,${this.state.selectedOctave},${this.state.selectedKey},${0},${0}`
                          // used for setting colors on octave change
                          this.selectedGangBank = '1|1|0'
                          // used to set active on .param
                          this.setState({currentParam: '1|1|0'})

                          // update colors
                          setKeySensorsColors(palette, this.props.keySensors.ganged_12[1], this.state.selectedOctave, 0)

                          // set sensor edit mode to key
                          if(Number(sensorEditMode) === 0) onSetSensorEditMode(1)

                          if(this.state.initialClickedSensors[sensorID]) return

                          this.setState((prevState) => {
                            return {
                              initialClickedSensors: {
                                ...prevState.initialClickedSensors,
                                [sensorID]: Number(e.target.value)
                              },
                              octaveReady: true
                            }
                          })
                        }
                      }
                    />
                  </div>
                  <div
                    className={ classnames('param key-gain', {'active': this.state.currentParam === '1|1|1'}) }
                    data-tip={tooltips['editor-sensor-adjustment-off']}
                    data-multiline="true"
                    data-place="left"
                    data-tip-disable={!showTooltips}
                    >
                    <label>Off</label>
                    <NumberInput
                      name={ classnames(`keyoffthreshold`) }
                      value={ this.state.selectedKeyOff }
                      min={ 0 } max={ 254 }
                      disabled={ this.state.selectedKey === -1 }
                      onChange={ value => {
                        if(value === null) return

                        const keyOffThreshold = clamp(value, 0, 254)

                        // update state and check revertable
                        this.setState({selectedKeyOff: keyOffThreshold}, () => {
                          // update overrides and send audition message
                          const gangBank = '1|1',
                                sensorData = [
                                  this.state.selectedOctave,
                                  this.state.selectedKey,
                                  1,
                                  0,
                                  keyOffThreshold
                                ].join(',')

                          onSetOverrideSensor(gangBank, sensorData, sensorEditMode < 2 ? 0 : sensorEditMode)
                          onAuditionSensor(gangBank, sensorData, sensorEditMode < 2 ? 0 : sensorEditMode)

                          setTimeout(() => { // timout to account for delay in setting state
                            // update colors
                            setKeySensorsColors(palette, this.props.keySensors.ganged_12[1], this.state.selectedOctave, 1)
                            // update overrides
                            this.updateOverrides()
                          }, 100)
                        })
                      }}
                      onFocus={
                        (e) => {
                          e.target.select()
                          // ganged 12, bank 1
                          const sensorID = `1,1,${this.state.selectedOctave},${this.state.selectedKey},${1},${0}`
                          // used for setting colors on octave change
                          this.selectedGangBank = '1|1|1' // add side param
                          // used to set active on .param
                          this.setState({currentParam: '1|1|1'})

                          // update colors
                          setKeySensorsColors(palette, this.props.keySensors.ganged_12[1], this.state.selectedOctave, 1)

                          // set sensor edit mode to key
                          if(Number(sensorEditMode) === 0) onSetSensorEditMode(1)

                          if(this.state.initialClickedSensors[sensorID]) return

                          this.setState((prevState) => {
                            return {
                              initialClickedSensors: {
                                ...prevState.initialClickedSensors,
                                [sensorID]: Number(e.target.value)
                              },
                              octaveReady: true
                            }
                          })
                        }
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={
                  classnames('key-gain-dialog', {'revertable': !isEqual(this.state.initialOverrides, this.props.keySensors.overrides)})
                }>
                <Button
                  name={'save edits'}
                  disabled={!deviceConnected || isEqual(this.state.initialOverrides, this.props.keySensors.overrides)}
                  data-tip={tooltips['editor-sensor-adjustment-save']}
                  data-multiline="true"
                  data-place="top"
                  data-tip-disable={!showTooltips}
                  onClick={() => {
                    this.setState((prevState) => {
                      return {
                        initialClickedSensors: {},
                        initialOverrides: {
                          ...this.props.keySensors.overrides
                        }
                      }
                    }, () => console.log('>> Sensor Adjustment: save edits',this.state.initialOverrides))
                    onWriteSensorBanks()
                  }}
                />
                <Button
                  name={'revert edits'}
                  disabled={!deviceConnected || isEqual(this.state.initialOverrides, this.props.keySensors.overrides)}
                  data-tip={tooltips['editor-sensor-adjustment-revert']}
                  data-multiline="true"
                  data-place="top"
                  data-tip-disable={!showTooltips}
                  onClick={() => {
                    this.setState({
                      selectedOctave: 0,
                      selectedKey: -1,
                      selectedKeyOn: -1,
                      selectedKeyOff: -1,
                      selectedKeyDamp: -1,
                      selectedSensorSide: -1,
                      selectedSensor: -1,
                      selectedSensorGain: -1,
                      selectedSensorMax: -1,
                      initialOverrides: {},
                      initialClickedSensors: {}
                    })

                    this.props.onGetSensorData()

                    this.shouldUpdateCheck = true
                    this.shouldUpdateFlag = 0
                    this.selectedGangBank = '0|0'

                    // clear 'active' sensor/key state and colors
                    clearSensorColors()
                    clearActiveKey()
                    document.querySelector('.key-gain-editor').classList.remove('ready')
                    console.log('>> Sensor Adjustment: revert sensors. refreshing sensor data')
                  }}
                />
                <Button
                  name={'reset all sensors to factory'}
                  disabled={!deviceConnected}
                  data-tip={tooltips['editor-sensor-adjustment-reset']}
                  data-multiline="true"
                  data-place="top"
                  data-type="error"
                  data-tip-disable={!showTooltips}
                  onClick={() => {
                    this.setState({
                      selectedOctave: 0,
                      selectedKey: -1,
                      selectedKeyOn: -1,
                      selectedKeyOff: -1,
                      selectedKeyDamp: -1,
                      selectedSensorSide: -1,
                      selectedSensor: -1,
                      selectedSensorGain: -1,
                      selectedSensorMax: -1,
                      initialOverrides: {},
                      initialClickedSensors: {}
                    })

                    this.props.onEraseSensorBanks()
                    this.props.onGetSensorData()

                    this.shouldUpdateCheck = true
                    this.shouldUpdateFlag = 0
                    this.selectedGangBank = '0|0'

                    // clear 'active' sensor/key state and colors
                    clearSensorColors()
                    clearActiveKey()
                    document.querySelector('.key-gain-editor').classList.remove('ready')
                    console.log('>> Sensor Adjustment: revert sensors to factory. refreshing sensor data')
                  }}
                />
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

function setSensorColors(palette, sensorValues, octave) {
  // sensorValues = this.props.keySensors.ganged_2[bank]
  const sensors = [...document.querySelectorAll('#keySensors rect')]
  sensorValues[octave].forEach((key,keyIndex) => {
    key.forEach((side, sideIndex) => {
      side.forEach((sensorValue, sensorIndex) => {
        const currentSensor = sensors.find(sensorRect => sensorRect.id === `sensor_K${keyIndex}_${sideIndex === 0 ? 'L' : 'R'}${sensorIndex}`)
        if(currentSensor) currentSensor.setAttribute('fill', palette[sensorValue])
      })
    })
  })
}

function setKeySensorsColors(palette, sensorValues, octave, modeSide) {
  // sensorValues = this.props.keySensors.ganged_12[bank]
  sensorValues[octave].forEach((key,keyIndex) => {
    const currentKey = [...document.querySelectorAll(`rect[id^=sensor_K${keyIndex}]`)]
    key.forEach((side, sideIndex) => {
      if(sideIndex === modeSide) {
        // if on-threhold ignore right side
        const currentKeyValue = sensorValues[octave][keyIndex][sideIndex][0]
        currentKey.forEach(keyRect => keyRect.setAttribute('fill', palette[currentKeyValue]))
      }
    })
  })
}

function clearSensorColors() {
  const sensors = [...document.querySelectorAll('#keySensors rect')]
  sensors.forEach(sensor => sensor.setAttribute('fill', '#333'))
}

function clearActiveKey() {
  document.querySelectorAll('#keySensors g').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('#keySensors path').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('#keySensors rect').forEach(s => s.classList.remove('active'))
}

const mapStateToProps = (state) => {
  return {
    deviceConnected: state.device.connected,
    sensorEditMode: state.editor.sensorEditMode,
    keyGainModeOpen: state.editor.keyGainModeOpen,
    keySensors: state.keySensors,
    showTooltips: state.editorPreferences.showTooltips
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onCloseKeyGainMode: () => {
      dispatch(closeKeyGainMode())
    },
    onSetSensorEditMode: (mode) => {
      dispatch(setSensorEditMode(mode))
    },
    onGetSensorData: () => {
      dispatch(requestSensorBanks())
    },
    onAuditionSensor: (gangBank, sensorData, editMode) => {
      dispatch(sendAuditionSensor(gangBank, sensorData, editMode))
    },
    onSetOverrideSensor: (gangBank, sensorData, editMode) => {
      dispatch(setOverrideSensor(gangBank, sensorData, editMode))
    },
    onRemoveOverrideSensor: (sensorID) => {
      dispatch(removeOverrideSensor(sensorID))
    },
    onWriteSensorBanks: () => {
      dispatch(sendWriteSensorBanks())
    },
    onSendRecalculateSensors: () => {
      dispatch(sendRecalculateSensorData())
    },
    onEraseSensorBanks: () => {
      dispatch(sendEraseSensorBank(0))
      dispatch(sendEraseSensorBank(1))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyGain)
