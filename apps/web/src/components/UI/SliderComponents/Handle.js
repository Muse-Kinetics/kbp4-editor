// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import PropTypes from 'prop-types'

import arrowUp from '../../../svg/arrow-up.svg'
import arrowLeft from '../../../svg/arrow-left.svg'
import arrowRight from '../../../svg/arrow-right.svg'

import tooltips from '../../../constants/tooltips.json'

export default function Handle({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps,
  label,
  splitKey,
  onSelectSplit,
  showTooltip
}) {

  let handleImage, displayKey

  if(splitKey === 48) {
    handleImage = arrowLeft
    displayKey = ''
  } else if(splitKey === 0) {
    handleImage = arrowRight
    displayKey = ''
  } else {
    handleImage = arrowUp
    displayKey = splitKey + 1
  }

  return (
    <div
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      data-tip={tooltips['editor-keyboard-zone-handle']}
      data-multiline="true"
      data-place="top"
      data-tip-disable={!showTooltip}
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: '-11px',
        marginTop: '-11px',
        zIndex: 2,
        width: 20,
        height: 20,
        cursor: 'grabbing',
        backgroundImage: `url(${handleImage})`,
        backgroundRepeat: 'no-repeat'
      }}
      {...getHandleProps(id)}
    >
    <div className='split-line'></div>
      <div style={{
          fontFamily: 'Lato',
          fontSize: 11,
          marginTop: 18,
          textAlign: 'center'
        }}>
        {displayKey}
      </div>

    </div>
  )
}

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}
