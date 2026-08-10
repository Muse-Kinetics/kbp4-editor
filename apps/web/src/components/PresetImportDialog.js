// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { readAsText } from 'promise-file-reader'

import { getDuplicates } from '../utilities'

import Button from './UI/Button'

import tooltips from '../constants/tooltips.json'

import {
  addPreset,
  openPresetRenamer,
  setTempImportedPresets
} from '../actions/'

class FileDialogue extends Component {
  componentDidMount(){
    this.fileSelector = buildFileSelector();
  }

  handleFileSelect = (e) => {
    this.fileSelector.addEventListener('change', () => {
      let file = this.fileSelector.files[0];

      if (!file.name.match(/\.(json)$/)) return

      readAsText(file)
        .then(presetsAsString => {
          const importedPresets = JSON.parse(presetsAsString),
                duplicateNames = getDuplicates(this.props.presetsUser, importedPresets)

          if(Object.keys(duplicateNames).length) {
            console.log('>> User Preset Names already exist', Object.values(duplicateNames).join(', '));
            this.props.onSetTempImportedPresets(importedPresets, duplicateNames)
            this.props.onOpenPresetRenamer();
          } else {
            console.log('>> Importing User Presets:', importedPresets.map(p => p.name).join(', '))
            this.props.onAddPresets('user', importedPresets)
          }
        })
        .catch(err => console.warn('>> Could not import presets', err))
    });

    this.fileSelector.click();
  }

  render(){
    const {
      showTooltips,
    } = this.props

    return <Button
      name='Import'
      data-tip={tooltips['preferences-import-user-presets']}
      data-multiline="true"
      data-place="bottom"
      data-tip-disable={!showTooltips}
      onClick={this.handleFileSelect}
    />
  }
}

function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');

  return fileSelector;
}

const mapStateToProps = (state) => {
  return {
    isBeta: state.editor.beta,
    presetsUser: state.presets.user,
    userPresetDialogOpen: state.editor.userPresetDialogOpen,
    presetsImportRenameDialogOpen: state.editor.presetsImportRenameDialogOpen,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPresets: (category, presets) => {
      presets.forEach(preset => dispatch(addPreset(category, preset)))
    },
    onSetTempImportedPresets: (importedPresets, duplicateNames) => {
      dispatch(setTempImportedPresets(importedPresets, duplicateNames))
    },
    onOpenPresetRenamer: () => {
      dispatch(openPresetRenamer())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDialogue)
