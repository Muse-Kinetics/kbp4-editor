// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import noteNames from '../constants/noteNames'

let noteOffsetBase = 35, octaveBase = 12

function getMIDINote(bar, lowNote, octave) {
  const noteOffsets = [0, 2, 4, 5, 7, 9, 11]
  return bar + noteOffsetBase + noteOffsets[lowNote] + (octaveBase * octave)
}

export function getMIDIBar(note, velocity, lowNote, octave) {
  // const noteOffsets = [0, 2, 4, 5, 7, 9, 11]
  /*
    note: 47
    octave: 0
    lowNote: 3 'F'
    bar: 7 '#bar_7'
  */
  /*
    note: 47
    octave: 0
    lowNote: 2 'E'
    bar: 9 '#bar_9'
  */
  /*
    note: 47
    octave: 0
    lowNote: 1 'D'
    bar: 11 '#bar_11'
  */
  // note - (octave * 12)

  // return noteOffsetBase + noteOffsets[lowNote] + (octaveBase * octave)
  // set selectedBar
  return [
    // bar,
    // velocity
  ]
}

function getNote(bar, lowNote, octave) {
  const noteOffsets = [0, 2, 4, 5, 7, 9, 11]

  return noteNames[bar + noteOffsetBase + noteOffsets[lowNote] + (octaveBase * octave)]
}

export function makeBarInfo(bar, lowNote, octave, gapCaps, barGainMode) {
  const BAR_ID = ~~bar.id.replace('bar_', ''),
        GAP_ID = ~~bar.id.replace('gap_', ''),
        capNote = ~~bar.dataset.note,
        barIndex = ~~bar.dataset.bar,
        MIDI = BAR_ID === 0 ? capNote : getMIDINote(BAR_ID, lowNote, octave),
        note = BAR_ID === 0 ? noteNames[capNote] : getNote(BAR_ID, lowNote, octave),
        gapCapTitle = (BAR_ID === 0 ? ` · GapCap: ${GAP_ID + 1}`: '' )

  const info = [
        `Bar: ${barIndex + 1}`,
        `${gapCapTitle} `,
        `· MIDI: ${MIDI === -1 ? 'off' : MIDI } `,
        `· Note: ${note ? note : 'off'}`
      ]

  let finalInfo = ''

  if(barGainMode) {
    finalInfo = info.slice(0,1).join('') + ' · Gain: '
  } else {
    finalInfo = (BAR_ID === 0) ? info.slice(0,2).join('') : info.join('')
  }

  return finalInfo
}

export function collide(el1, el2) {
  const rect1 = el1.getBoundingClientRect(),
        rect2 = el2.getBoundingClientRect()

  return !(
    rect1.right <= rect2.left ||
    rect1.left >= rect2.right
  );
}

export function keyCollision(handle, paths){
  // each time the handle is moved
  let splitKey = 0,
      lastPath = paths[paths.length - 1];
  // loop through keyOffsets
  [...paths].forEach(path => {
    if(handle.getBoundingClientRect().right > lastPath.getBoundingClientRect().x) { // handle drag to upper zone off
      splitKey = 48
    } else if(collide(handle, path)) {
      document.querySelector(`path#key${path.dataset.stem}`).classList.add('split')

      splitKey = path.dataset.stem
    } else {
      document.querySelector(`path#key${path.dataset.stem}`).classList.remove('split')
    }
  })
  return splitKey
}
