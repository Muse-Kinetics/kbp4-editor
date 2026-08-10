// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { default as ReactButton, themes } from 'react-button'
import classnames from 'classnames'

import { formatClassNames } from '../../utilities'
import ButtonThemes from './ButtonThemes'

const noNameTypes = ['round', 'fader', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'fader-horizontal', 'fader-vertical']

// themes = { ...themes, ButtonThemes }

const Button = (props) => {
  // let { name, value, type, toggle, onClick } = props
  // const classNames = classnames('button', type, formatClassNames(name), { toggled: toggle && this.state.isToggled })

  return <ReactButton>{'name'}</ReactButton>

    // return (
    //   <button
    //     type="button"
    //     className={classNames}
    //     value={value}
    //     onClick={(event) => this.handleClick(event)} >
    //     { (noNameTypes.includes(type)) ? '' : name }
    //   </button>
    // )


}

export default Button
