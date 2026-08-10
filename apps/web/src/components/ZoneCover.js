// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import offsets from '../constants/keyOffsets'
import tooltips from '../constants/tooltips.json'

import './ZoneCover.css'

import {
  selectZone
} from '../actions/'

const zoneIndex = ['lower-zone', 'upper-zone']

class ZoneCover extends Component {
  clickHandler = (e) => {
    [...document.querySelectorAll('.zone-cover')].forEach(el => el.classList.remove('active'))
    e.target.classList.add('active')

    this.props.onSelectZone(zoneIndex.indexOf(e.target.classList[1]))
  }

  render() {
    const {
      selectedZone,
      splitPoint,
      visualzerActive,
      autohideZoneBackground,
      showTooltips
    } = this.props

    let zoneStyles = {
      lower: {"width": `${parseFloat((offsets[splitPoint].x / 974) * 100) ? parseFloat((offsets[splitPoint].x / 974) * 100) : 100 }%`},
      upper: {"width": `${parseFloat((offsets[splitPoint].x / 974) * 100) ? 100 - parseFloat((offsets[splitPoint].x / 974) * 100) : 0 }%`}
    }

    return (
      <>
        <div
          className={
            classnames(
              "zone-cover",
              "lower-zone",
              {off: splitPoint === 0},
              {"full-zone": splitPoint === 48},
              {active: selectedZone === 0 || splitPoint === 48},
              {autohide: visualzerActive || autohideZoneBackground}
            )}
          style={zoneStyles.lower}
          data-tip={tooltips['editor-keyboard-lower-zone']}
          data-multiline="true"
          data-place="bottom"
          data-tip-disable={!showTooltips}
          onClick={this.clickHandler}
        >Lower</div>
  			<div
          className={
            classnames(
              "zone-cover",
              "upper-zone",
              {off: splitPoint === 48},
              {"full-zone": splitPoint === 0},
              {active: selectedZone === 1 || splitPoint === 0},
              {autohide: visualzerActive || autohideZoneBackground}
            )}
          style={zoneStyles.upper}
          data-tip={tooltips['editor-keyboard-upper-zone']}
          data-multiline="true"
          data-place="bottom"
          data-tip-disable={!showTooltips}
          onClick={this.clickHandler}
        >Upper</div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedZone: state.editor.selectedZone,
    visualzerActive: state.editor.visualzerActive,
    splitPoint: state.currentPreset.zone_split_key_num,
    autohideZoneBackground: state.editorPreferences.autohideZoneBackground,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectZone: (value) => {
      dispatch(selectZone(value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoneCover)
