// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import classnames from 'classnames'

import './StatusLogos.css'
import KBoardPro4Logo from '../svg/k-board-pro-4-logo.svg';

import StatusBar from './StatusBar'

export default function StatusLogos(props) {
  return (
    <div className={classnames("status-logos", {connected: props.connected})}>
      <img className="k-board-pro-4-logo" src={KBoardPro4Logo} draggable="false" alt="K-Board Pro 4"/>
      <StatusBar />
    </div>
  )
}
