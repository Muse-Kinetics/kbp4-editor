// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

class Visualizer extends Component {
  componentDidMount(){

  }

  update() {
    
  }

  draw() {

  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    keys: state.currentPreset.keys,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualizer)
