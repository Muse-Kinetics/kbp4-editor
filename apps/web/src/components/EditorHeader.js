// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import './EditorHeader.css'

import PresetManager from './PresetManager'
import StatusLogos from './StatusLogos'

class EditorHeader extends Component {

  componentDidMount() {
    /*
      schedule a series of startup actions with requestIdleCallback
      each task gets executed sequentially and efficiently
    */
  }

  render() {
    return (
      <header className={classnames({'beta':this.props.isBeta})}>
        <PresetManager />
        <StatusLogos connected={ this.props.connected } />
      </header>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isBeta: state.editor.beta,
    connected: state.device.connected
  }
}

export default connect(mapStateToProps, null)(EditorHeader)
