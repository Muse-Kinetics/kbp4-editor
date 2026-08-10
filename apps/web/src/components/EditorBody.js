// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'

import './EditorBody.css'

import PreferencesButton from './PreferencesButton'
import KBoardKeys from './KBoardPro4Keys'
import TabbedSections from './TabbedSections'

export default class EditorBody extends Component {
  render() {
    return (
      <section>
        <PreferencesButton />
        <KBoardKeys />
        <TabbedSections />
      </section>
    )
  }
}
