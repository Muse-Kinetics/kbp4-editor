// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// import { ipcRenderer, remote } from 'electron'
import isElectron from 'is-electron'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import Select from 'react-simpler-select'
import classnames from 'classnames'

import './UI/Input.css'
import './Preferences.css'
import './UI/Select.css'

import Button from './UI/Button'
import Toggle from './UI/Toggle'
import FileDialogue from './PresetImportDialog'

import KBoardPro4Logo from '../svg/k-board-pro-4-logo.svg';
import tooltips from '../constants/tooltips.json'

// import { asyncLocalStorage } from '../utilities/'

import {
  toggleTooltips,
  toggleAutohideZoneSlider,
  openPreferences,
  fetchFirmware,
  resetDevice,
  downloadUserPresets,
  setStatusMessage,
  setEditorUpdatingStatus,
  setDownloadProgress,
  setMIDIThruPort
} from '../actions'

// const { Menu } = remote

class Preferences extends Component {
  componentDidMount() {
    // Native menu → renderer IPC. The desktop preload exposes window.ipcRenderer;
    // it's absent in a plain browser, so these simply don't register there.
    // (Previously the whole block was commented out during the Electron
    // modernization, which is why the Hardware > Update Firmware menu item — and
    // the other menu actions — did nothing.)
    if(window.ipcRenderer) {
      window.ipcRenderer.on('toggle-tooltips', (event, value) => this.props.onToggleTooltips(value))
      window.ipcRenderer.on('preset-export', () => this.props.onDownloadUserPresets())
      window.ipcRenderer.on('firmware-update', () => this.props.onFetchFirmware(this.props.availableFirmware.url))
      window.ipcRenderer.on('installing-update', () => {
        this.props.onSetStatusMessage('Downloading Editor')
        this.props.onSetEditorUpdatingStatus()
      })
      window.ipcRenderer.on('download-progress', (event, percent) => this.props.onSetDownloadProgress(percent))
      // sync the native Help > Show Tooltips checkbox to the actual (possibly
      // persisted) tooltip state on launch — otherwise the menu item starts
      // unchecked while tooltips are on, so the first click just re-syncs the box.
      // At cold launch the native menu isn't realized yet when we mount, so an
      // immediate set doesn't stick; re-send after a short delay to cover that.
      const syncTooltipsMenu = () => {
        if(window.ipcRenderer) window.ipcRenderer.send('menu-toggle-tooltips', { checked: this.props.showTooltips })
      }
      syncTooltipsMenu()
      setTimeout(syncTooltipsMenu, 1500)
    }
  }

  componentDidUpdate(prevProps) {
    // keep the menu checkbox in sync when tooltips are toggled (menu or in-app)
    if(window.ipcRenderer && prevProps.showTooltips !== this.props.showTooltips) {
      window.ipcRenderer.send('menu-toggle-tooltips', { checked: this.props.showTooltips })
    }
  }

  componentWillUnmount() {
    if(window.ipcRenderer) {
      window.ipcRenderer.removeAllListeners('toggle-tooltips')
      window.ipcRenderer.removeAllListeners('preset-export')
      window.ipcRenderer.removeAllListeners('firmware-update')
      window.ipcRenderer.removeAllListeners('installing-update')
      window.ipcRenderer.removeAllListeners('download-progress')
    }
  }
  handleCloseModal = () => {
    this.props.onClosePreferences()
  }

  afterOpenModal = () => {
    ReactTooltip.rebuild()
  }

  render() {
    const {
      userPresetLength,
      preferencesOpen,
      statusMessage,
      deviceConnected,
      networkConnection,
      firmwareVersion,
      bootloaderVersion,
      availableFirmware,
      firmwareUpdateAvailable,
      updatingFirmware,
      bootloaderMode,
      editorVersion,
      editorUpdateAvailable,
      showTooltips,
      autohideZoneBackground,
      onFetchFirmware,
      onToggleTooltips,
      onToggleZoneSliders,
      onResetDevice,
      onDownloadUserPresets,
      onSetMIDIThruPort
    } = this.props

    let formattedMessage = statusMessage.replace(/\s+/g, '-')

    let allowFirmware = false

    if(isElectron()) {
      allowFirmware = ((deviceConnected || bootloaderMode) && !updatingFirmware)
      //console.log("elec allowFirmware:", allowFirmware);
    } else {
      // console.log('networkConnection', networkConnection, 'deviceConnected', deviceConnected, 'bootloaderMode', !bootloaderMode, 'updatingFirmware', !updatingFirmware)
      allowFirmware = (deviceConnected || bootloaderMode) && !updatingFirmware && networkConnection;
      //console.log("allowFirmware:", allowFirmware, "dc: ", deviceConnected, "uf: ", updatingFirmware, " nc: ", networkConnection);
    }

    

    return (
      <div className='preferences-modal'>
        <ReactModal
          isOpen={preferencesOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          className="react-modal"
          overlayClassName="react-modal-overlay"
          contentLabel="Preferences"
        >
          <div
            className={
              classnames(
                'preferences-panel',
                // {'electron': isElectron()}
              )
            }>
            <div className='logo'>
              <img className="KBoardPro4-logo" src={KBoardPro4Logo} draggable="false" alt="K-Board Pro 4"/>
            </div>
            <div className='status-message'>{statusMessage}</div>
            <div className='status-bar' data-status-message={formattedMessage}>
              <span className='progress-bar'></span>
            </div>
            <div
              className='device-versions'
              data-tip={tooltips['preferences-versions']}
              data-multiline="true"
              data-place="top"
              data-tip-disable={!showTooltips}
              >
              <span className='label'>Editor:</span>
              <span className='version'>v.{editorVersion}</span>
              { editorUpdateAvailable && deviceConnected && <span className='update-message editor-update'>update available</span> }
              <br />
              <span className='label'>Firmware:</span>
              <span className='version'>v.{firmwareVersion}</span>
              { firmwareUpdateAvailable && deviceConnected && <span className='update-message firmware-update'>update available</span> }
              <br />
              <span className='label'>Bootloader:</span>
              <span className='version'>v.{bootloaderVersion}</span>
            </div>
            <div className='pref-section editor-prefs'>
              <h3 className='pref-header'>Editor</h3>

              <div className='label-button toggle-item'>
                <label
                  data-tip={tooltips['preferences-tooltips']}
                  data-multiline="true"
                  data-place="bottom"
                  data-tip-disable={!showTooltips}
                  >Tooltips
                </label>
                <Toggle
                  checked={showTooltips}
                  onChange={(event) => {
                  /*
                  if(isElectron()) {
                      const menu = Menu.getApplicationMenu()
                      // set menu item
                      asyncLocalStorage.getItem('k-board-pro-4_editorPreferences').then(preferences => {
                        menu.getMenuItemById('show_tooltips').checked = JSON.parse(preferences).showTooltips
                      })
                    }
                  */
                  onToggleTooltips(event.target.checked)
                }
              }
              />
              </div>
              <div className='label-button toggle-item'>
                <label
                data-tip={tooltips['preferences-autohide-zone-handles']}
                data-multiline="true"
                data-place="bottom"
                data-tip-disable={!showTooltips}
                >Autohide Zone background</label>
                <Toggle
                  checked={autohideZoneBackground}
                  onChange={(event) => onToggleZoneSliders(event.target.checked)}
                />
              </div>
            </div>
            <div className='pref-section presets-prefs'>
              <h3 className='pref-header'>Presets</h3>
              <div className='label-button'>
                Export User Presets
                <Button
                  name='Export'
                  data-tip={tooltips['preferences-export-user-presets']}
                  data-multiline="true"
                  data-place="bottom"
                  data-tip-disable={!showTooltips}
                  disabled={!userPresetLength}
                  onClick={onDownloadUserPresets}
                />
              </div>
              <div className='label-button'>
                Import User Presets
                <FileDialogue />
              </div>
            </div>
            <div className='pref-section device-prefs'>
              <h3 className={classnames('pref-header', {'disabled': !deviceConnected})}>Device</h3>
              <div className={classnames('label-button', { 'disabled': !deviceConnected })}>
                MIDI THRU
                <Select
                  name="midithru"
                  value={this.props.midithruport}
                  data-tip={tooltips['preferences-device-midi-thru']}
                  data-multiline="true"
                  data-tip-disable={!showTooltips}
                  options={window.midithruports || [{ value: 'none', label: 'None', disabled: false }]}
                  onChange={(name) => {
                    onSetMIDIThruPort(name)
                    // set thru port on window
                    window.kbp4thru = window.midithruports.find(p => p.value === name).port
                  }}
                />
              </div>
              <div className={classnames('label-button', {'disabled': !deviceConnected})}>
                Device Reset
                <Button
                  name='Reset'
                  data-tip={tooltips['preferences-device-reset']}
                  data-multiline="true"
                  data-place="top"
                  data-type="error"
                  data-tip-disable={!showTooltips}
                  disabled={!deviceConnected ? true : ''}
                  onClick={onResetDevice}
                />
              </div>
              <div className={ classnames('label-button', {'disabled': !allowFirmware }) }>
                Update Firmware
                <Button
                  name='Update'
                  data-tip={tooltips['preferences-update-firmware']}
                  data-multiline="true"
                  data-place="bottom"
                  data-tip-disable={!showTooltips}
                  disabled={ allowFirmware ? '' : 'disabled' }
                  onClick={() => onFetchFirmware(availableFirmware.url)}
                />
              </div>
            </div>
            <div
              className='close'
              data-tip={tooltips['preferences-close']}
              data-multiline="true"
              data-place="right"
              data-tip-disable={!showTooltips}
              onClick={this.handleCloseModal}
            >X</div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userPresetLength: state.presets.user.length,
    statusMessage: state.editor.statusMessage,
    networkConnection: state.editor.networkConnection,
    preferencesOpen: state.editor.preferencesOpen,
    editorVersion: state.editor.editorVersion,
    editorUpdateAvailable: state.editor.editorUpdateAvailable,
    updateableEditor: state.editor.updateableEditor,
    downloadProgress: state.editor.downloadProgress,
    midithruport: state.editor.midithruport,
    showTooltips: state.editorPreferences.showTooltips,
    autohideZoneBackground: state.editorPreferences.autohideZoneBackground,
    deviceConnected: state.device.connected,
    bootloaderVersion: state.device.bootloaderVersion,
    firmwareVersion: state.device.firmwareVersion,
    updatingFirmware: state.device.updatingFirmware,
    availableFirmware: state.device.availableFirmware,
    firmwareUpdateAvailable: state.device.firmwareUpdateAvailable,
    bootloaderMode: state.device.bootloaderMode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClosePreferences: () => {
      dispatch(openPreferences(false))
    },
    onToggleTooltips: (active) => {
      dispatch(toggleTooltips(active))
    },
    onToggleZoneSliders: (active) => {
      dispatch(toggleAutohideZoneSlider(active))
    },
    onResetDevice: () => {
      dispatch(resetDevice())
    },
    onDownloadUserPresets: () => {
      dispatch(downloadUserPresets())
    },
    onFetchFirmware: (url) => {
      dispatch(fetchFirmware(url))
    },
    onSetStatusMessage: (status) => {
      dispatch(setStatusMessage(status))
    },
    onSetEditorUpdatingStatus: () => {
      dispatch(setEditorUpdatingStatus())
    },
    onSetDownloadProgress: (percent) => {
      dispatch(setDownloadProgress(percent))
    },
    onSetMIDIThruPort: (name) => {
      dispatch(setMIDIThruPort(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences)
