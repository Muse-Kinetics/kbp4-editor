// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { default as ToggleButton } from 'react-toggle'

import './Toggle.css'

export default function Toggle(props) {

  return (
    <div className={'toggle'}>
      <ToggleButton
        { ...props }
      />
    </div>
  )
}
