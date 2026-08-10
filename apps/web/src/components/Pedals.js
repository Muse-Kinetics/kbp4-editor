// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'

import './Pedals.css'

import Pedal from './Pedal'

import {
  setPedalMode,
  setPedalCC,
  setPedalZone
} from '../actions/'

const Pedals = (props) => {
  const {
    pedals,
    onSetPedalMode,
    onSetPedalCC,
    onSetPedalZone,
    showTooltips
  } = props

  return (
    <div className="pedals">
      {[0,1].map(pedalIndex => {
        return (
          <Pedal
            key={pedalIndex}
            pedalIndex={pedalIndex}
            pedals={pedals}
            setMode={onSetPedalMode}
            setCC={onSetPedalCC}
            setZone={onSetPedalZone}
            tooltip={showTooltips}
          />
        )
      })
    }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    pedals: state.currentPreset.pedals,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetPedalMode: (pedal, mode) => {
      dispatch(setPedalMode(pedal, ~~mode))
    },
    onSetPedalCC: (pedal, cc) => {
      dispatch(setPedalCC(pedal, ~~cc))
    },
    onSetPedalZone: (pedal, zone) => {
      dispatch(setPedalZone(pedal, ~~zone))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pedals)
