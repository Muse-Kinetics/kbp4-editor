// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import isWindows from 'is-windows'
import classnames from 'classnames'

import './UI/Input.css'
import './VelocityCurves.css'

import Button from './UI/Button'

import { getRange } from '../utilities'

import curveTables from '../constants/curveTables.json'
import tooltips from '../constants/tooltips.json'

import {
  closeVelocityCurves,
  selectVelocityCurve,
  selectUserCurve,
  saveUserCurve,
  setNoteOnVelocityCurve,
  setKeyAxisCurve,
  setReleaseVelocityCurve,
  setPitchBendReturnCurve,
  setRevertableCurve
} from '../actions'

const userCurveMenuItems = ['User Curve 1', 'User Curve 2', 'User Curve 3', 'User Curve 4']
const userCurveButtons = userCurveMenuItems.map(name => name.replace('Curve ', ''))

class VelocityCurves extends Component {
  state = {
    freshCurve: true,
    revertToCurve: this.props.selectedVelocityCurve
  }

  handleCloseModal = () => {
    this.props.onCloseVelocityCurves()
    this.props.onSelectVelocityCurve(-1)
    this.props.onSelectUserCurve(0)
    this.multislider.destroy()
   }

  afterOpenModal = async () => {
    // nexusui is imported lazily (only when this modal opens, inside a user
    // gesture) so its eager AudioContext / ScriptProcessorNode init doesn't run
    // — and warn/crash — at app load. Matches the malletStation/BopPad fix.
    const Nexus = (await import('nexusui')).default

    const currentCurveIndex = this.props.noteOnVelocityTable[this.props.selectedZone]

    this.multislider = new Nexus.Multislider('#velocity-curves', {
     'size': [750,350],
     'numberOfSliders': 128,
     'min': 0,
     'max': 127,
     'step': 1,
     'candycane': 1,
     'smoothing': 1,
     'mode': 'bar',
     'values': currentCurveIndex < 7 ? [...curveTables[Object.keys(curveTables)[currentCurveIndex]]] : [...this.props.userCurves[`usercurve-${currentCurveIndex - 7}`]]
    })
    // set multislider styles
    Nexus.colors.accent = "#04aef0"
    this.multislider.colorize("fill","#333")
    this.multislider.colorize("accent","#04aef0")

    // select user-1 button
    this.props.onSelectVelocityCurve(this.props.noteOnVelocityTable[this.props.selectedZone])
    // reset revertable curve on open
    this.props.onSetRevertableCurve(false)

    this.multislider.on('change', (v) => {
      if(!this.state.freshCurve) return

      if(this.multislider.hasMoved) {
        // set curve to not-fresh
        this.setState({
          freshCurve: false
        })

        // deselect curve button
        this.props.onSelectVelocityCurve(-1)
        // maroon color for save & send, reset button
        this.props.onSetRevertableCurve(true)
        // select curve destination button 1
        // this.props.onSelectUserCurve(0)
      }
    })

    this.multislider.element.addEventListener('mouseover', (e) => {
      if(e.target.nodeName === 'rect') {
        const bars = Array.from(document.querySelectorAll('#velocity-curves rect')),
              index = Math.floor([...bars].indexOf(e.target) / 2),
              sliderYValue = 350 - parseFloat(e.target.getAttribute('y')),
              yAxisPos = Math.round(getRange(sliderYValue, [0,350,0,127]))

        document.querySelector('.y-axis-position').innerHTML = `Bar ${index} Value ${yAxisPos}`
      }
    })

    ReactTooltip.rebuild()
  }

  render() {
    const {
      userCurves,
      deviceConnected,
      velocityCurvesOpen,
      curveEditorOpener,
      selectedVelocityCurve,
      selectedUserCurve,
      revertableCurve,
      onSaveUserCurve,
      onSelectVelocityCurve,
      onSelectUserCurve,
      onSetNoteOnVelocityCurve,
      onSetAxisCurve,
      onSetPitchBendReturnCurve,
      onSetReleaseVelocityCurve,
      onSetRevertableCurve,
      showTooltips
    } = this.props

    return (
      <div className='velocity-curves-modal'>
        <ReactModal
          isOpen={velocityCurvesOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={false}
          className="react-modal"
          overlayClassName="react-modal-overlay"
          contentLabel="Velocity Curves"
        >
          <div className='velocity-curves-editor'>
            <div
              className='velocity-curve-buttons'
              data-tip={tooltips['editor-velocity-curves-curves']}
              data-multiline="true"
              data-place="top"
              data-tip-disable={!showTooltips}
              >
              {[...Object.keys(curveTables), ...userCurveButtons].map((name, index) =>
                <Button
                  name={name}
                  key={name}
                  index={index}
                  value={name}
                  toggle={selectedVelocityCurve}
                  onClick={button => {
                    this.setState({
                      freshCurve: true,
                      revertToCurve: button.dataset.index
                    })

                    // select the curve in the preset and send to device edit buffer
                    if(button.value.includes('User')) {
                      this.multislider.setAllSliders([...userCurves[`usercurve-${button.dataset.index - 7}`]])
                    } else {
                      this.multislider.setAllSliders([...curveTables[button.value]])
                    }
                    // reset revertbale curve on new curve
                    onSetRevertableCurve(false)
                    // select curve in editor
                    onSelectVelocityCurve(button.dataset.index)

                    // select curve in preset
                    if(curveEditorOpener.includes('noteOnVelocity')){
                      onSetNoteOnVelocityCurve(button.dataset.index)
                    } else if(curveEditorOpener.includes('releaseVelocity')){
                      onSetReleaseVelocityCurve(button.dataset.index)
                    } else if(curveEditorOpener.includes('keyAxis')){
                      const [, axis] = curveEditorOpener.split('-')
                      onSetAxisCurve(axis, button.dataset.index)
                    } else if(curveEditorOpener.includes('pitchBend')){
                      onSetPitchBendReturnCurve(button.dataset.index)
                    }
                  }} />
              )}
              <Button
                name='X'
                onClick={() => {
                  // revert to the preset curve?
                  this.handleCloseModal()
                }}
                data-tip={tooltips['editor-velocity-curves-close']}
                data-multiline="true"
                data-place="top"
                data-tip-disable={!showTooltips}
              />
            </div>
            <div
              id='velocity-curves'
              data-tip={tooltips[`editor-velocity-curves-editor${isWindows() ? '-windows' : ''}`]}
              data-multiline="true"
              data-place="left"
              data-type={isWindows() ? "warning" : "light" }
              data-tip-disable={!showTooltips}
              ></div>
            <div
              className={
                classnames(
                  'user-curve-dialog',
                  {'revertable': revertableCurve}
                )}>
              <span
                data-tip={tooltips[`editor-velocity-curves-destination-label`]}
                data-multiline="true"
                data-place="bottom"
                data-type="light"
                data-tip-disable={!showTooltips}
                className='label'>
                  Save Curve To:
                </span>
                {userCurveButtons.map((name, index) =>
                  <Button
                    data-tip={tooltips[`editor-velocity-curves-destinations`]}
                    data-multiline="true"
                    data-place="bottom"
                    data-type="light"
                    data-tip-disable={!showTooltips}
                    name={name}
                    key={name}
                    index={index}
                    value={name}
                    toggle={selectedUserCurve}
                    onClick={button => {
                      onSelectUserCurve(~~button.dataset.index)
                    }} />
                )}
              <div className='curve-dialog-spacer'></div>
              <Button
                name="save"
                onClick={() => {
                  // reset revertbale curve on save
                  onSetRevertableCurve(false)
                  // save curve
                  onSaveUserCurve(selectedUserCurve, [...this.multislider.values])
                  // set curve in the preset
                  if(curveEditorOpener.includes('noteOnVelocity')){
                    onSetNoteOnVelocityCurve(7 + selectedUserCurve)
                  } else if(curveEditorOpener.includes('releaseVelocity')){
                    onSetReleaseVelocityCurve(7 + selectedUserCurve)
                  } else if(curveEditorOpener.includes('keyAxis')){
                    const [, axis] = curveEditorOpener.split('-')
                    onSetAxisCurve(axis, 7 + selectedUserCurve)
                  } else if(curveEditorOpener.includes('pitchBend')){
                    onSetPitchBendReturnCurve(7 + selectedUserCurve)
                  }
                }}
                disabled={!deviceConnected || (this.state.freshCurve && (selectedUserCurve+7 === selectedVelocityCurve))}
                data-tip={tooltips['editor-velocity-curves-user-save']}
                data-multiline="true"
                data-place="bottom"
                data-tip-disable={!showTooltips}
              />
              <Button
                name="reset"
                onClick={() => {
                  this.setState({
                    freshCurve: true
                  })
                  // reset revertbale curve on reset
                  onSetRevertableCurve(false)
                  onSelectVelocityCurve(this.state.revertToCurve)

                  if(this.state.revertToCurve >= 7) {
                    // reset to user curve
                    this.multislider.setAllSliders([...userCurves[`usercurve-${this.state.revertToCurve - 7}`]])
                  } else {
                    this.multislider.setAllSliders([...curveTables[Object.keys(curveTables)[this.state.revertToCurve]]])
                  }
                }}
                disabled={this.state.freshCurve}
                data-tip={tooltips['editor-velocity-curves-user-reset']}
                data-multiline="true"
                data-place="bottom"
                data-tip-disable={!showTooltips}
              />
            </div>
            <div className="y-axis-position"></div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deviceConnected: state.device.connected,
    velocityCurvesOpen: state.editor.velocityCurvesOpen,
    curveEditorOpener: state.editor.curveEditorOpener,
    selectedVelocityCurve: state.editor.selectedVelocityCurve,
    selectedUserCurve: state.editor.selectedUserCurve,
    selectedZone: state.editor.selectedZone,
    revertableCurve: state.editor.revertableCurve,
    noteOnVelocityTable: state.currentPreset.note_on_velocity_table_index,
    userCurves: state.userCurves,
    showTooltips: state.editorPreferences.showTooltips
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onSelectVelocityCurve: (index) => {
      dispatch(selectVelocityCurve(~~index))
    },
    onCloseVelocityCurves: () => {
      dispatch(closeVelocityCurves())
    },
    onSetNoteOnVelocityCurve: (index) => {
      dispatch(setNoteOnVelocityCurve(~~index))
    },
    onSetAxisCurve: (axis, index) => {
      dispatch(setKeyAxisCurve(~~axis, ~~index))
    },
    onSetReleaseVelocityCurve: (value) => {
      dispatch(setReleaseVelocityCurve(value))
    },
    onSetPitchBendReturnCurve: (curve) => {
      dispatch(setPitchBendReturnCurve(curve))
    },
    onSelectUserCurve: (index) => {
      dispatch(selectUserCurve(~~index))
    },
    onSaveUserCurve: (index, curve) => {
      dispatch(saveUserCurve(~~index, curve))
    },
    onSetNoteOnVelocityTable: (index) => {
      dispatch(setNoteOnVelocityCurve(~~index))
    },
    onSetRevertableCurve: (mode) => {
      dispatch(setRevertableCurve(mode))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VelocityCurves)
