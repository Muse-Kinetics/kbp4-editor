// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'

import tooltips from '../constants/tooltips.json'

const StatusBar = (props) => {
  let {
    statusMessage,
    editorVersion,
    showTooltips,
    downloadProgress
  } = props

  let formattedMessage = statusMessage.replace(/\s+/g, '-').toLowerCase()

  return (
    <div
      className="status-bar-message"
      data-tip={tooltips['device-status-message']}
      data-multiline="true"
      data-tip-disable={!showTooltips}
      >
      <span className="editor-version">v.{editorVersion}</span>
      <span className="status-message">{statusMessage}</span>
      <div className="status-bar" data-status-message={formattedMessage}>
        <span className="progress-bar" style={{
            width: formattedMessage === 'downloading-editor' ? `${downloadProgress}%` : 'auto'
          }}></span>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    statusMessage: state.editor.statusMessage,
    editorVersion: state.editor.editorVersion,
    downloadProgress: state.editor.downloadProgress,
    showTooltips: state.editorPreferences.showTooltips
  }
}

export default connect(mapStateToProps, null)(StatusBar)
