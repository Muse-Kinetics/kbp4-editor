// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import classnames from 'classnames'

import './Button.css'
import { formatClassNames } from '../../utilities'

export default function LabelButton(props) {
  let { name, value, type, onClick } = props
  const classNames = classnames('button', type, formatClassNames(name))

  return (
    <div className="label-button">
      <label>
        { name }
        <button className={classNames} value={value} onClick={onClick}>
          { (type === 'round' || type === 'fader' || type === 'fader-horizontal') ? '' : name }
        </button>
      </label>
    </div>
  )
}
