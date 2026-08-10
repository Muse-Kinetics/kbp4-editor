// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// import { ipcRenderer } from 'electron'
// import isElectron from 'is-electron'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { readAsText } from 'promise-file-reader'
import compareVersions from 'compare-versions'

import './PresetManager.css'

import resourceURLs from '../constants/deviceResourcePaths'
import tooltips from '../constants/tooltips.json'

import { asyncFetchJSON, getDuplicates } from '../utilities'

import PresetManagerSelect from './PresetManagerSelect'
import PresetManagerUser from './PresetManagerUser'
import PresetManagerUserDialog from './PresetManagerUserDialog'

import {
  addPreset,
  setAvailableFirmware,
  setAvailableEditor,
  setUpdateableEditor,
  setUpdatesAvailable,
  openPresetRenamer,
  setTempImportedPresets
} from '../actions/'

class PresetManager extends Component {
  componentDidMount() {
    // native "Import Presets" menu → renderer (desktop preload bridge)
    if(window.ipcRenderer) {
      window.ipcRenderer.on('preset-import', (event, presets) => this.props.onAddPresets('user', presets))
    }

    if(navigator.onLine) {
      try {
        Promise.all([
          // get currentVersions of firmware
          asyncFetchJSON(resourceURLs[this.props.isBeta ? 'firmwareCurrentVersionBeta' : 'firmwareCurrentVersion']),
          // get currentVersions of editor
          asyncFetchJSON(resourceURLs[this.props.isBeta ? 'editorCurrentVersionBeta' : 'editorCurrentVersion']),
          // get factory presets
          asyncFetchJSON(resourceURLs[this.props.isBeta ? 'factoryPresetsBeta' : 'factoryPresets']),
          // get factory presets versions. used in editor to prompt getting new presets
          asyncFetchJSON(resourceURLs[this.props.isBeta ? 'factoryPresetsCurrentVersionBeta' : 'factoryPresetsCurrentVersion'])
        ]).then(versions => {
          const [ availableFirmware, availableEditor, factoryPresets ] = versions
          if(versions.some(v => v === false)) {
              // send message or status
              console.warn('>> K-Board Pro 4 Editor: network issues')
          } else {
            this.props.onSetAvailableFirmware(availableFirmware)
            this.props.onSetAvailableEditor(availableEditor)
            // set update editor available flag
            this.props.onSetUpdateableEditor(compareVersions(availableEditor.version, this.props.editorVersion))
            // add factory presets
            this.props.onAddPresets('factory', factoryPresets)
          }
        })
      } catch (e) {
        console.error(`>> K-Board Pro 4: could not fetch resources, due to network issues: ${e}`);
      }
    } else {
      // do something here for offline functionality 
    }
  }

  componentWillUnmount() {
    if(window.ipcRenderer) window.ipcRenderer.removeAllListeners('preset-import')
    // cancel server resource calls
  }

  onDrop = (acceptedFiles, rejectedFiles, onAddPresets, presetsUser) => {
    const {
      onOpenPresetRenamer,
      onSetTempImportedPresets
    } = this.props

    acceptedFiles.forEach(file => {
      readAsText(file)
        .then(presetsAsString => {
          const importedPresets = JSON.parse(presetsAsString),
                duplicateNames = getDuplicates(presetsUser, importedPresets)

          if(Object.keys(duplicateNames).length) {
            console.log('>> User Preset Names already exist', Object.values(duplicateNames).join(', '));
            onSetTempImportedPresets(importedPresets, duplicateNames)
            onOpenPresetRenamer();
          } else {
            console.log('>> Importing User Presets:', importedPresets.map(p => p.name).join(', '))
            onAddPresets('user', importedPresets)
          }
        })
        .catch(err => console.warn('>> Could not import presets', err))
    });
  }

  render() {
    const {
      presetsUser,
      userPresetDialogOpen,
      showTooltips,
      onAddPresets,
      onOpenPresetRenamer
    } = this.props

    return (
      <Dropzone
        className='preset-manager-drop'
        style={{}}
        activeClassName='active-drop'
        acceptClassName='accept-file-drop'
        rejectClassName='reject-file-drop'
        disableClick={true}
        accept='application/json'
        onDrop={(accepted, rejected) => this.onDrop(accepted, rejected, onAddPresets, presetsUser, onOpenPresetRenamer)}
        >
        <div
          className="preset-manager"
          data-tip={tooltips['preset-manager']}
          data-multiline="true"
          data-tip-disable={!showTooltips}
        >
          <PresetManagerSelect />
          {(userPresetDialogOpen) ? <PresetManagerUserDialog /> : <PresetManagerUser /> }
        </div>
      </Dropzone>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deviceFirmwareVersion: state.device.firmwareVersion,
    isBeta: state.editor.beta,
    editorVersion: state.editor.editorVersion,
    presetsUser: state.presets.user,
    userPresetDialogOpen: state.editor.userPresetDialogOpen,
    presetsImportRenameDialogOpen: state.editor.presetsImportRenameDialogOpen,
    networkConnection: state.editor.networkConnection,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPresets: (category, presets) => {
      presets.forEach(preset => dispatch(addPreset(category, preset)))
    },
    onSetAvailableFirmware: (version) => {
      dispatch(setAvailableFirmware(version))
    },
    onSetAvailableEditor: (version) => {
      dispatch(setAvailableEditor(version))
    },
    onSetUpdateableEditor: (updateable) => {
      dispatch(setUpdateableEditor(updateable))
    },
    onSetUpdatesAvailable: () => {
      dispatch(setUpdatesAvailable())
    },
    onSetTempImportedPresets: (importedPresets, duplicateNames) => {
      dispatch(setTempImportedPresets(importedPresets, duplicateNames))
    },
    onOpenPresetRenamer: () => {
      dispatch(openPresetRenamer())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager)
