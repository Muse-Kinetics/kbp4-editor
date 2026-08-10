// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import './BarsCaps.css'
import './BarGain.css'

import BarGain from './BarGain'

import MalletStationBars from './MalletStationBars'
// https://github.com/evenchange4/svgr.macro-example
// https://github.com/facebook/create-react-app/issues/3856

class Bars extends Component {

  render() {
    return (
      <div className={classnames('bars', {'bar-gain-mode': this.props.barGainModeOpen})}>
        <BarGain />
        <MalletStationBars />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    barGainModeOpen: state.editor.barGainModeOpen
  }
}

export default connect(mapStateToProps, null)(Bars)
