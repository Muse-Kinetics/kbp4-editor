// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'

import SplitSlider from './UI/SplitSlider'
import Bars from './Bars'
import BarsCapsSettings from './BarsCapsSettings'

import tooltips from '../constants/tooltips.json'

const BarsCaps = (props) => {
  return (
    <div className="bars-caps">
      <h2
        data-tip={tooltips['editor-bars-caps']}
        data-multiline="true"
        data-place="top"
        data-tip-disable={!props.showTooltips}
      >Bars & Caps</h2>
      <SplitSlider name="zone-a" label="A" />
      <Bars />
      <SplitSlider name="zone-b" label="B" />
      <BarsCapsSettings />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    showTooltips: state.editorPreferences.showTooltips
  }
}

export default connect(mapStateToProps, null)(BarsCaps)
