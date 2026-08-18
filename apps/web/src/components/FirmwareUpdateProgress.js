// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { firmwareUpdateDismiss } from '../actions'

import './FirmwareUpdateProgress.css'

const SUPPORT_URL = 'https://support.musekinetics.com/'
// desktop editor releases — same GitHub repo this project publishes itself to
// (see apps/desktop/package.json's build.publish GitHub provider).
const DESKTOP_EDITOR_URL = 'https://github.com/Muse-Kinetics/kbp4-editor/releases/latest'

// Progress mapping (per product spec):
//   central board  -> 0-50%
//   peripheral (4 octave boards) -> 51-100%
// Central has no per-chunk events (it's one whole SysEx send), so the central
// bar is animated forward while it flashes; the peripheral range advances by
// real per-board events.
class FirmwareUpdateProgress extends Component {
  state = { centralPercent: 0 }
  _centralTimer = null

  componentDidUpdate(prevProps) {
    const { firmwareStage } = this.props

    if(firmwareStage === 'central' && prevProps.firmwareStage !== 'central') {
      this.startCentralAnimation()
    }
    if(firmwareStage !== 'central' && prevProps.firmwareStage === 'central') {
      this.stopCentralAnimation()
    }
    if(firmwareStage === 'idle' && prevProps.firmwareStage !== 'idle') {
      this.setState({ centralPercent: 0 })
    }
  }

  componentWillUnmount() {
    this.stopCentralAnimation()
  }

  // creep the central bar toward 50% so the user sees movement during the flash
  startCentralAnimation = () => {
    this.stopCentralAnimation()
    this.setState({ centralPercent: 2 })
    this._centralTimer = setInterval(() => {
      this.setState(s => ({ centralPercent: Math.min(50, s.centralPercent + 1) }))
    }, 500)
  }

  stopCentralAnimation = () => {
    if(this._centralTimer) {
      clearInterval(this._centralTimer)
      this._centralTimer = null
    }
  }

  percent() {
    const { firmwareStage, firmwareBoardsUpdated, firmwareBoardsExpected } = this.props
    const peripheralPercent = 50 + (firmwareBoardsUpdated / firmwareBoardsExpected) * 50
    switch(firmwareStage) {
      case 'central': return this.state.centralPercent
      case 'peripheral': return Math.max(51, peripheralPercent)
      case 'complete': return 100
      case 'error': return firmwareBoardsUpdated > 0 ? peripheralPercent : this.state.centralPercent
      default: return 0
    }
  }

  label() {
    const { firmwareStage, firmwareBoardsUpdated, firmwareBoardsExpected } = this.props
    switch(firmwareStage) {
      case 'central': return 'Updating central board…'
      case 'peripheral': return `Updating octaves — ${firmwareBoardsUpdated} of ${firmwareBoardsExpected}`
      case 'complete': return 'Firmware update complete!'
      case 'error': return this.props.firmwareError
      case 'unsupported': return 'Firmware updates aren\'t supported from a web browser on Windows. Please download the K-Board Pro 4 desktop editor to update your firmware.'
      default: return 'Preparing firmware update…'
    }
  }

  // open an external link (system browser under Electron, new tab in a browser)
  // then dismiss the popup — wired to the error/unsupported-state buttons.
  openExternal = (url) => {
    if(window.ipcRenderer && typeof window.ipcRenderer.send === 'function') {
      window.ipcRenderer.send('open-external', url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    this.props.onDismiss()
  }

  handleGetSupport = () => this.openExternal(SUPPORT_URL)
  handleDownloadDesktopEditor = () => this.openExternal(DESKTOP_EDITOR_URL)

  render() {
    const { firmwareStage, onDismiss } = this.props
    if(!firmwareStage || firmwareStage === 'idle') return null

    const isError = firmwareStage === 'error'
    const isComplete = firmwareStage === 'complete'
    const isUnsupported = firmwareStage === 'unsupported'
    const pct = this.percent()

    return (
      <div className="firmware-update-overlay">
        <div className={classnames('firmware-update-message', { error: isError, complete: isComplete, unsupported: isUnsupported })}>
          <div className="firmware-update-title">
            { isError ? 'Firmware Update Failed'
              : isComplete ? 'Firmware Updated'
              : isUnsupported ? 'Desktop Editor Required'
              : 'Firmware Updating…' }
          </div>
          <div className="firmware-update-progress-label">{this.label()}</div>
          { !isUnsupported &&
            <>
              <div className="firmware-update-progress">
                <div
                  className={classnames('firmware-update-progress-bar', { error: isError })}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="firmware-update-progress-meta">{Math.round(pct)}%</div>
            </>
          }

          { isError &&
            <button className="firmware-update-button" onClick={this.handleGetSupport}>
              Get Support
            </button>
          }
          { isComplete &&
            <button className="firmware-update-button" onClick={onDismiss}>
              Done
            </button>
          }
          { isUnsupported &&
            <>
              <button className="firmware-update-button" onClick={this.handleDownloadDesktopEditor}>
                Download Desktop Editor
              </button>
              <button className="firmware-update-button secondary" onClick={onDismiss}>
                Close
              </button>
            </>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  firmwareStage: state.device.firmwareStage,
  firmwareBoardsUpdated: state.device.firmwareBoardsUpdated,
  firmwareBoardsExpected: state.device.firmwareBoardsExpected,
  firmwareError: state.device.firmwareError
})

const mapDispatchToProps = (dispatch) => ({
  onDismiss: () => dispatch(firmwareUpdateDismiss())
})

export default connect(mapStateToProps, mapDispatchToProps)(FirmwareUpdateProgress)
