// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import NumericInput from 'react-numeric-input';
import classnames from 'classnames'

import { formatClassNames } from '../../utilities'

import './NumberInput.css'

export default function NumberInput(props) {
  let {
    name
  } = props

  const classNames = classnames('number-input', formatClassNames(name))
/*
  let mouseNumStartPosition = {},
      numStart

  function mouseDown(e) {
    mouseNumStartPosition.y = e.pageY;
    numStart = parseInt(value);
    numStart = isNaN(numStart) ? 0 : numStart;

    // add listeners for mousemove, mouseup
    window.addEventListener("mousemove", mousemoveNum);
    window.addEventListener("mouseup", mouseupNum);
  }

  function mousemoveNum(e) {
    let diff = mouseNumStartPosition.y - e.pageY,
        maxValue = typeof max === 'function' ? max() : max,
        newValue = numStart + diff;

    newValue = newValue < 0 ? 0 : newValue;
    newValue = newValue > maxValue ? maxValue : newValue;

    e.target.value = newValue;
    e.target.dispatchEvent(new Event("change"))

    // console.log('target', e.target.value);
  }

  function mouseupNum(e) {
    window.removeEventListener("mousemove", mousemoveNum);
    window.removeEventListener("mouseup", mouseupNum);
  }
*/
  return (
    <div className={classNames}>
      <NumericInput
        noStyle
        onFocus = { e => e.target.select() }
        {...props}
      />
    </div>
  )
}
// onWheel = { e => console.log('wheel', e) }
// onMouseDown = { mouseDown }
// onMouseLeave = { mouseLeave }
