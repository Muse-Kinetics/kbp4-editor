// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import NumericInput from 'react-numeric-input';
import classnames from 'classnames'

import { formatClassNames } from '../../utilities'
import noteNames from '../../constants/noteNames'

import './NumberInput.css'

export default function MIDINoteInput(props) {
  const { name, value, onChange, onInput, onBlur, format } = props

  const classNames = classnames('number-input', 'midi-note', formatClassNames(name), {off: ~~value === -1})
/*
function midiNoteFormatter(value) {
	return (isNaN(value)) ? `${noteNames.indexOf(value)}       ${value}` : `${value}       ${noteNames[value]}`
}
*/
  return (
    <div className={classNames}>
      {/* left input is MIDI */}
      <NumericInput
        style={false}
        min={0}
        max={127}
        value={value}
        step={1}
        format={format}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
      />
      {/* left input is Note */}
      {/* <input type='text' value="C#4"/> */}
      <NumericInput
        style={false}
        min={0}
        max={127}
        value={value}
        step={1}
        format={value => noteNames[value]}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
      />
      <div className='midi-note-labels'>
        <span className='midi'>nidi</span>
        <span className='note'>note</span>
      </div>
    </div>
  )
}
