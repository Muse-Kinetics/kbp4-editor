// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import classnames from 'classnames'

import './Input.css'

import { formatClassNames } from '../../utilities'

export default function input(props) {
  const {
    name,
    min,
    max,
    value,
    placeholder,
    onInput,
    onChange,
    onKeyPress,
    inputRef
  } = props
  const classNames = classnames('input', formatClassNames(`${name}`))

  return <input
    type="text"
    className={classNames}

    ref={inputRef}
    defaultValue={value}
    placeholder={placeholder}
    onChange={onChange}
    onInput={onInput}
    onKeyPress={onKeyPress}
    minLength={min}
    maxLength={max}
    data-tip={props['data-tip']}
    data-type={props['data-type']}
    data-multiline={props['data-multiline']}
    data-tip-disable={props['data-tip-disable']}
    data-place={props['data-place']}
  />
}
