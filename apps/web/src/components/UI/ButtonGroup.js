// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import classnames from 'classnames'

import './Button.css'
import Button from './Button'

export default function ButtonGroup(props) {
  const { buttons, type, onClick } = props
  const classNames = classnames('button-group', type)

  return (
    <div className={classNames}>
      { buttons.map((button,i) => <Button
        name={button.name}
        value={button.name}
        type={type}
        key={i}
        toggle={button.toggle}
        onClick={onClick} />)
      }
    </div>
  )
}
