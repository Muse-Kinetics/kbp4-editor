// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import Sliders from './Sliders'
import Pedals from './Pedals'

import './SlidersPedals.css'

// import tooltips from '../constants/tooltips.json'

class SlidersPedals extends Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    return (
      <div className={classnames("sliders-pedals")}>
        <Sliders />
        <Pedals />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedZone: state.editor.selectedZone,
    showTooltips: state.editorPreferences.showTooltips
  }
}

export default connect(mapStateToProps, null)(SlidersPedals)
