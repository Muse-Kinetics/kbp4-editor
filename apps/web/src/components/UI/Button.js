// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// react-button component https://github.com/tim-group/react-button

import React, { Component } from 'react'
import classnames from 'classnames'

import './Button.css'
import { formatClassNames } from '../../utilities'

const noNameTypes = ['round', 'fader', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'fader-horizontal', 'fader-vertical']

/*
  if 'toggle' prop is truthy and the passed in value is equal it the buttons index add className 'toggled'

*/

class Button extends Component {
  buttonEl = React.createRef();

  handleClick = (e) => {
    this.props.onClick && this.props.onClick(this.buttonEl.current)
  }

  render() {
    let {
      name,
      value,
      kind,
      index,
      toggle,
      disabled
    } = this.props

    const classNames = classnames(
      'button',
      kind,
      name && formatClassNames(name),
      {toggled:((toggle !==null) && (toggle === ~~index))}
    )

    return (
      <button
        type="button"
        className={classNames}
        value={value}
        data-index={index}
        onClick={this.handleClick}
        ref={this.buttonEl}
        data-tip={this.props['data-tip']}
        data-type={this.props['data-type']}
        data-multiline={this.props['data-multiline']}
        data-tip-disable={this.props['data-tip-disable']}
        data-place={this.props['data-place']}
        disabled={disabled}
      >
        { (noNameTypes.includes(kind)) ? '' : name }
      </button>
    )
  }
}

export default Button
