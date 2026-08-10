// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import ReactTooltip from 'react-tooltip'

import './PresetsImportRenameDialog.css'

import Button from './UI/Button'

import PresetsImportRenameInput from './PresetsImportRenameInput'

import tooltips from '../constants/tooltips.json'

import {
  setImportedNames,
  closePresetRenamer,
  resetImportedNames,
  addPreset
} from '../actions'

class PresetsImportRenameDialog extends Component {
  afterOpenModal = () => {
    ReactTooltip.rebuild()
  }

  handleCloseModal = () => {
    this.props.onCloseImportedPresetsRenamer()
    // reset
    this.props.onResetImportedNames()
  }

  render() {
    const {
      presetsImportRenameDialogOpen,
      importedPresets,
      onSetImportedNames,
      onAddPreset,
      showTooltips
    } = this.props

    return (
      <div className='presets-import-rename'>
        <ReactModal
          isOpen={presetsImportRenameDialogOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={false}
          className="react-modal"
          overlayClassName="react-modal-overlay"
          contentLabel="Rename Presets"
        >
          <div className='imported-preset-renamer'>
            <div
              className='close'
              data-tip={tooltips['preset-import-close']}
              data-multiline="true"
              data-place="right"
              data-tip-disable={!showTooltips}
              onClick={this.handleCloseModal}
            >X</div>
            <h3>Rename Imported Presets</h3>
            <p>{Object.values(importedPresets.duplicates).length} preset names already exist, enter a unique name for the  presets below. (32 character limit)<br /><br />
            Duplicate or blank names will not be imported.</p>
            <div className='duplicate-names'>
            {
              Object.values(importedPresets.duplicates).map((name, index) => {
                return (
                  <div className='duplicate-name-field' key={index}>
                    <label>{name}</label>
                    <PresetsImportRenameInput name={name} index={index} />
                  </div>
                )
              })
            }
            </div>
            <div className='button-group'>
              <Button
                name={'Cancel Import'}
                data-tip={tooltips['preset-import-cancel']}
                data-multiline="true"
                data-place="left"
                data-tip-disable={!showTooltips}
                onClick={this.handleCloseModal}
              />
              <Button
                name={'Import Presets'}
                data-tip={tooltips['preset-import-import']}
                data-multiline="true"
                data-place="right"
                data-tip-disable={!showTooltips}
                onClick={() => {
                  onSetImportedNames(importedPresets.renamed)

                  onAddPreset(importedPresets)

                  this.handleCloseModal()
                }}
              />
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    presetsImportRenameDialogOpen: state.editor.presetsImportRenameDialogOpen,
    importedPresets: state.editor.importedPresets,
    showTooltips: state.editorPreferences.showTooltips
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onSetImportedNames: (duplicateNames) => {
      dispatch(setImportedNames(duplicateNames))
    },
    onResetImportedNames: () => {
      dispatch(resetImportedNames())
    },
    onCloseImportedPresetsRenamer: () => {
      dispatch(closePresetRenamer())
    },
    onAddPreset: (importedPresets) => {
      Object.keys(importedPresets.renamed).forEach(index => {
        let name = importedPresets.renamed[index]
        if(!!name) dispatch(addPreset('user', { ...importedPresets.presets[index], name: name }))
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetsImportRenameDialog)
