// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// import PressureCircle from './PressureCircle'
// import PressureCircles from './PressureCircles'
// import Particles from './Particles'
import PressureCirclesDashed from './PressureCirclesDashed'

import { parsePitchBend, convertRange, getMIDIRange, isInStem, getStemMode, getKeyByValue as getAxis } from '../../utilities'
import bendRangeTable from '../../constants/pitchBendRangeTable'
import draw from './draw'

// set the type of visual element to use
const Sprite = PressureCirclesDashed

let updatePixelDensity = false

// this is for Visualzier key clipping when switching between screen resolutions
const mm = window.matchMedia('screen and (min-resolution: 2dppx)')

// listen for screen DPI changes
mm.addEventListener("change", (e) => {
  updatePixelDensity = true

  if (e.matches) {
    /* devicePixelRatio >= 2 */
    console.log('devicePixelRatio >= 2')
  } else {
    /* devicePixelRatio < 2 */
    console.log('devicePixelRatio < 2')
  }
});
/*
const axisModeOptions = [
  { label: 'Off', value: 0 },
  { label: 'Pitch Bend Absolute', value: 1 },
  { label: 'Pitch Bend Relative', value: 2 }, // only for X-Axis & Y-Axis
  { label: 'Pitch Bend |x|', value: 9 }, // only for X-Axis
  { label: 'CC Absolute', value: 3 },
  { label: 'CC Relative', value: 4 },
  { label: 'Channel Pressure Absolute', value: 5 },
  { label: 'Channel Pressure Relative', value: 6 },
  { label: 'Poly Aftertouch Absolute', value: 7 }, // only for Y-Axis & Z-Axis
  { label: 'Poly Aftertouch Relative', value: 8 } // only for Y-Axis & Z-Axis
]
*/
const messageTypes = {
  0: 0,
  1: 224,
  2: 224,
  3: 176,
  4: 176,
  5: 208,
  6: 208,
  7: 160,
  8: 160,
  9: 224
}

let activeChannels = [],
    activeNotes = {0:[], 1:[]},
    isMIDI = false

export default function(midi, preset) {
  const {
      keys,
      octave,
      transpose,
      pitch_bend,
      mpe_mode: isMPE,
      zone_split_key_num: splitKey,
      device_channels: MIDIChannels,
      number_of_MPE_member_channels: MPEChannels
    } = preset

  const type = midi[0] & 0xf0,
        channel = midi[0] & 0xf,
        bendRange = pitch_bend.member_range

  // get zone from channel
  let zone, MIDIZone

  if(splitKey === 0){ // only upper zone
    // master channel is 15
    zone = 1
    MIDIZone = 1
  } else if(splitKey === 48) { // only lower zone
    // master channel is 0
    zone = 0
    MIDIZone = 0
  } else { // dual zone
    // master channels are 0, 15
    zone = channel <= MPEChannels[0] ? 0 : 1
    MIDIZone = channel === MIDIChannels[0] ? 0 : 1
  }

  // get axis modes
  const XMode = keys[0].mode[isMPE ? zone : MIDIZone],
        YMode = keys[1].mode[isMPE ? zone : MIDIZone],
        ZMode = keys[2].mode[isMPE ? zone : MIDIZone]

  // get CC modes
  const XCC = keys[0].cc[isMPE ? zone : MIDIZone],
        YCC = keys[1].cc[isMPE ? zone : MIDIZone],
        ZCC = keys[2].cc[isMPE ? zone : MIDIZone]

  // get y-axis relative start
  const YStart = keys[1].relative_start[isMPE ? zone : MIDIZone]

  // set message type axis
  const messageAxes = {
    'x': messageTypes[XMode],
    'y': messageTypes[YMode],
    'z': messageTypes[ZMode]
  }
  
  // parse MIDI data into Axes
  if(isMPE === 0) { // MIDI Mode
    isMIDI = true

    switch (type) {
      case 128: {
          const note = midi[1]
          // remove note
          if(isActiveNote(MIDIZone, note)) {
            activeNotes[MIDIZone][note].key.clear()
            delete activeNotes[MIDIZone][note]
          }
        }
        break;
      case 144: {
          const note = midi[1],
                svgKeyIndex = ((~~note - ~~transpose[MIDIZone]) - (~~octave[MIDIZone] * 12))
          
          if(isNaN(svgKeyIndex) || (svgKeyIndex < 0 || svgKeyIndex > 47)) return

          if(!activeNotes[MIDIZone][note]) {
            activeNotes[MIDIZone][note] = newKey(channel, new Sprite(svgKeyIndex, note))
            activeNotes[MIDIZone][note].keyType = activeNotes[MIDIZone][note].key.offsets.width > 30 ? 'white' : 'blue'
            activeNotes[MIDIZone][note].axis = {
              x: activeNotes[MIDIZone][note].key.offsets.width / 2,
              y: (YMode === 2 || YMode === 4 || YMode === 6) ? YStart : 3,
              z: 7
            }
            activeNotes[MIDIZone][note].bendRange = bendRange[MIDIZone]
            activeNotes[MIDIZone][note].zone = MIDIZone
            activeNotes[MIDIZone][note].axesCC = {x: undefined, y: undefined, z: undefined}
            activeNotes[MIDIZone][note].inStem = false
            if(updatePixelDensity) {
              activeNotes[MIDIZone][note].key.updateScale()
              updatePixelDensity = false
            }
          }
        }

        break;
      case 160: { // poly after touch
        const pressureData = midi[2]
        // Z-Axis only
        // if(activeNotes[MIDIZone][midi[1]]){
          
        //   const currentKey = activeNotes[MIDIZone][midiNote]
        //   const radiusOffset = currentKey.key.offsets.width < 30 ? -9 : -15
        //   currentKey.axis['z'] = getMIDIRange(pressureData, [0, currentKey.key.offsets.width + radiusOffset]) * (currentKey.inStem ? getStemMode(currentKey.key.note).radiusScaler : 1)
        // }

        switch (getAxis(messageAxes, type)) {
          case 'x':
            activeNotes[MIDIZone].forEach(n => {
              n.axis[getAxis(messageAxes, type)] = getMIDIRange(pressureData, [0, n.key.offsets.width / (n.inStem ? 2 : 1)]) + (n.inStem ? getStemMode(n.key.note).xOffset : 0)
            })
            break;
          case 'y':
            activeNotes[MIDIZone].forEach(n => {
              n.axis[getAxis(messageAxes, type)] = getMIDIRange(pressureData, [0, n.key.offsets.height - (n.keyType === 'white' ? 10 : 5)])
              // set inStemMode
              n.inStem = isInStem(n)
            })
            break;
          case 'z':
            activeNotes[MIDIZone].forEach(n => {
              const radiusOffset = n.key.offsets.width < 30 ? -9 : -15
              n.axis[getAxis(messageAxes, type)] = getMIDIRange(pressureData, [0, n.key.offsets.width + radiusOffset]) * (n.inStem ? getStemMode(n.key.note).radiusScaler : 1)
            })
            break;
          default:

        }
      }
        break;
      case 176: // cc
        // x
        if ((XMode === 3 || XMode === 4) && midi[1] === XCC) {
          activeNotes[MIDIZone].forEach(n => {
            n.axesCC['x'] = midi[1]
            n.axis['x'] = getMIDIRange(midi[2], [0, n.key.offsets.width / (n.inStem ? 2 : 1)]) + (n.inStem ? getStemMode(n.key.note).xOffset : 0)
          })
        }
        // y
        if ((YMode === 3 || YMode === 4) && midi[1] === YCC) {
          activeNotes[MIDIZone].forEach(n => {
            n.axesCC['y'] = midi[1]
            n.axis['y'] = getMIDIRange(midi[2], [0, n.key.offsets.height])
            // set inStemMode
            n.inStem = isInStem(n)
          })
        }
        // z
        if ((ZMode === 3 || ZMode === 4) && midi[1] === ZCC) {
          activeNotes[MIDIZone].forEach(n => {
            const radiusOffset = n.key.offsets.width < 30 ? -9 : -15
            n.axesCC['z'] = midi[1]
            n.axis['z'] = getMIDIRange(midi[2], [0, n.key.offsets.width + radiusOffset]) * (n.inStem ? getStemMode(n.key.note).radiusScaler : 1)
          })
        }

        break;
      case 208: // channel-pressure
        const pressureData = midi[1]

        switch (getAxis(messageAxes, type)) {
          case 'x':
            activeNotes[MIDIZone].forEach(n => {
              n.axis[getAxis(messageAxes, type)] = getMIDIRange(pressureData, [0, n.key.offsets.width / (n.inStem ? 2 : 1)]) + (n.inStem ? getStemMode(n.key.note).xOffset : 0)
            })
            break;
          case 'y':
            activeNotes[MIDIZone].forEach(n => {
              n.axis[getAxis(messageAxes, type)] = getMIDIRange(pressureData, [0, n.key.offsets.height - (n.keyType === 'white' ? 10 : 5)])
              // set inStemMode
              n.inStem = isInStem(n)
            })
            break;
          case 'z':
            activeNotes[MIDIZone].forEach(n => {
              const radiusOffset = n.key.offsets.width < 30 ? -9 : -15
              n.axis[getAxis(messageAxes, type)] = getMIDIRange(pressureData, [0, n.key.offsets.width + radiusOffset]) * (n.inStem ? getStemMode(n.key.note).radiusScaler : 1)
            })
            break;
          default:

        }

        break;
      case 224: // pitch-bend
        const pitchBendData = parsePitchBend([midi[1], midi[2]])

        switch (getAxis(messageAxes, type)) {
          case 'x':
            activeNotes[MIDIZone].forEach(n => {
              if(n.bendRange === 0) {
                n.axis[getAxis(messageAxes, type)] = n.key.offsets.width / 2
              } else {
                n.axis[getAxis(messageAxes, type)] = convertRange(pitchBendData, bendRangeTable[n.bendRange], [0, n.key.offsets.width / (n.inStem ? 2 : 1)]) + (n.inStem ? getStemMode(n.key.note).xOffset : 0)
              }
            })
            break;
          case 'y':
            activeNotes[MIDIZone].forEach(n => {
              if(n.bendRange === 0) {
                n.axis[getAxis(messageAxes, type)] = n.key.offsets.height / 2
              } else {
                n.axis[getAxis(messageAxes, type)] = convertRange(pitchBendData, bendRangeTable[n.bendRange], [0, n.key.offsets.height - (n.keyType === 'white' ? 10 : 5)])
                // set inStemMode
                n.inStem = isInStem(n)
              }
            })

            break;
          case 'z':
            activeNotes[MIDIZone].forEach(n => {
              const radiusOffset = n.key.offsets.width < 30 ? -9 : -15
              if(n.bendRange === 0) {
                n.axis[getAxis(messageAxes, type)] = 7
              } else {
                n.axis[getAxis(messageAxes, type)] = convertRange(pitchBendData, bendRangeTable[n.bendRange], [0, n.key.offsets.width + radiusOffset]) * (n.inStem ? getStemMode(n.key.note).radiusScaler : 1)
              }
            })

            break;
          default:

        }

        break;
      default:

    }
    // adjust X offset when X-Axis is off
    if (XMode === 0) {
      activeNotes[MIDIZone].forEach(note => {
        let currentKey = note;
        let keyWidth = currentKey.key.offsets.width / 2
        let inStem = isInStem(currentKey)

        if (inStem) {
          const stemMode = getStemMode(currentKey.key.note)
          let offset = 0

          switch (stemMode.mode) {
            case 'left':
              offset = -7
              break;
            case 'center':
              offset = 0
              break;
            case 'center-left':
              offset = (stemMode.xOffset / 2) - 5
              break;
            case 'center-right':
              offset = (stemMode.xOffset / 2) - 2
              break;
            case 'right':
              offset = (stemMode.xOffset / 2)
              break;
            default:

          }

          currentKey.axis.x = keyWidth + offset
        } else {
          // reset 
          currentKey.axis.x = keyWidth
        }
      })
    }
  } else { // MPE Mode
    isMIDI = false
    
    switch (type) {
      case 128:
        // remove channel
        if(isActiveChannel(channel)) {
          activeChannels[channel-1].key.clear()
          delete activeChannels[channel-1]
        }

        break;
      case 144:
        // add channel
        const note = midi[1],
              svgKeyIndex = ((~~note - ~~transpose[zone]) - (~~octave[zone] * 12))

        if(isNaN(svgKeyIndex) || (svgKeyIndex < 0 || svgKeyIndex > 47)) return

        if(!activeChannels[channel-1]) {
          activeChannels[channel-1] = newKey(channel, new Sprite(svgKeyIndex, note))
          activeChannels[channel-1].keyType = activeChannels[channel-1].key.offsets.width > 30 ? 'white' : 'blue'
          activeChannels[channel-1].note = note
          activeChannels[channel-1].axis = {
            x: activeChannels[channel-1].key.offsets.width / 2,
            y: (YMode === 2 || YMode === 4 || YMode === 6) ? YStart : 3,
            z: 7
          }
          activeChannels[channel-1].bendRange = bendRange[zone]
          activeChannels[channel-1].zone = zone
          activeChannels[channel-1].axesCC = {x: undefined, y: undefined, z: undefined}
          activeChannels[channel-1].inStem = false
          if(updatePixelDensity) {
            activeChannels[channel-1].key.updateScale()
            updatePixelDensity = false
          }
        }

        break;
      case 160: { // poly aftertouch
          const currentKey = activeChannels.filter(k => k.note === midi[1])[0],
                pressureData = midi[2]
          let pressureValue = 0

          if (!currentKey) return;

          switch (getAxis(messageAxes, type)) {
            case 'x':
              pressureValue = getMIDIRange(pressureData, [0, currentKey.key.offsets.width / (currentKey.inStem ? 2 : 1)]) + (currentKey.inStem ? getStemMode(currentKey.key.note).xOffset : 0)
              break;
            case 'y':
              pressureValue = getMIDIRange(pressureData, [0, currentKey.key.offsets.height - (currentKey.keyType === 'white' ? 10 : 5)])
              // set inStemMode
              currentKey.inStem = isInStem(currentKey)
              break;
            case 'z':
              const radiusOffset = currentKey.key.offsets.width < 30 ? -9 : -15
              pressureValue = getMIDIRange(pressureData, [0, currentKey.key.offsets.width + radiusOffset]) * (currentKey.inStem ? getStemMode(currentKey.key.note).radiusScaler : 1)
              break;
            default:

          }
          // set the value here after switch figures out adjustments
          currentKey.axis[getAxis(messageAxes, type)] = pressureValue
        
        }
        break;
      case 176: // cc
        if(isActiveChannel(channel)) {
          const currentKey = activeChannels[channel-1],
                ccData1 = midi[1],
                ccData2 = midi[2]

          if ((XMode === 3 || XMode === 4) && ccData1 === XCC) {
            currentKey.axesCC.x = ccData1
            currentKey.axis['x'] = getMIDIRange(ccData2, [0, currentKey.key.offsets.width / (currentKey.inStem ? 2 : 1)]) + (currentKey.inStem ? getStemMode(currentKey.key.note).xOffset : 0)
          }
          if ((YMode === 3 || YMode === 4) && ccData1 === YCC) {
            currentKey.axesCC.y = ccData1
            currentKey.axis['y'] = getMIDIRange(ccData2, [0, currentKey.key.offsets.height - (currentKey.keyType === 'white' ? 10 : 5)])
            // set inStemMode
            currentKey.inStem = isInStem(currentKey)
          }
          if ((ZMode === 3 || ZMode === 4) && ccData1 === ZCC) {
            const radiusOffset = currentKey.key.offsets.width < 30 ? -9 : -15
            currentKey.axesCC.z = ccData1
            currentKey.axis['z'] = getMIDIRange(ccData2, [0, currentKey.key.offsets.width + radiusOffset]) * (currentKey.inStem ? getStemMode(currentKey.key.note).radiusScaler : 1)
          }
        }

        break;
      case 208: // channel-pressure
        if(isActiveChannel(channel)) {
          const currentKey = activeChannels[channel-1],
                pressureData = midi[1]
          let pressureValue = 0

          switch (getAxis(messageAxes, type)) {
            case 'x':
              pressureValue = getMIDIRange(pressureData, [0, currentKey.key.offsets.width / (currentKey.inStem ? 2 : 1)]) + (currentKey.inStem ? getStemMode(currentKey.key.note).xOffset : 0)
              break;
            case 'y':
              pressureValue = getMIDIRange(pressureData, [0, currentKey.key.offsets.height - (currentKey.keyType === 'white' ? 10 : 5)])
              // set inStemMode
              currentKey.inStem = isInStem(currentKey)
              break;
            case 'z':
              const radiusOffset = currentKey.key.offsets.width < 30 ? -9 : -15
              pressureValue = getMIDIRange(pressureData, [0, currentKey.key.offsets.width + radiusOffset]) * (currentKey.inStem ? getStemMode(currentKey.key.note).radiusScaler : 1)
              break;
            default:

          }
          // set the value here after switch figures out adjustments
          currentKey.axis[getAxis(messageAxes, type)] = pressureValue
        }

        break;
      case 224: // pitch-bend
        if(isActiveChannel(channel)) {
          const currentKey = activeChannels[channel-1],
                pitchBendData = parsePitchBend([midi[1], midi[2]])
          let pitchBendValue = 0

          // adjust data to key dimension
          switch(getAxis(messageAxes, type)) {
            case 'x':
              if(currentKey.bendRange === 0) {
                pitchBendValue = currentKey.key.offsets.width / 2
              } else {
                const keyWidth = currentKey.key.offsets.width / (currentKey.inStem ? 2 : 1)

                pitchBendValue = convertRange(pitchBendData, bendRangeTable[currentKey.bendRange], [0, keyWidth]) + (currentKey.inStem ? getStemMode(currentKey.key.note).xOffset : 0)
              }
              break;
            case 'y':
              if(currentKey.bendRange === 0) {
                pitchBendValue = currentKey.key.offsets.height / 2
              } else {
                pitchBendValue = convertRange(pitchBendData, bendRangeTable[currentKey.bendRange], [0, currentKey.key.offsets.height - (currentKey.keyType === 'white' ? 10 : 5)])
                // set inStemMode
                currentKey.inStem = isInStem(currentKey)
              }
              break;
            case 'z':
              const radiusOffset = currentKey.key.offsets.width < 30 ? -9 : -15
              if(currentKey.bendRange === 0) {
                pitchBendValue = 7 // account for key type?
              } else {
                pitchBendValue = convertRange(pitchBendData, bendRangeTable[currentKey.bendRange], [0, currentKey.key.offsets.width + radiusOffset]) * (currentKey.inStem ? getStemMode(currentKey.key.note).radiusScaler : 1)
              }
              break;
              default:
          }

          // set the value here after switch figures out adjustments
          currentKey.axis[getAxis(messageAxes, type)] = pitchBendValue
        }

        break;
      default:

    }
    // adjust X offset when the X-Axis is turned off
    if (XMode === 0) {
      // when x is off adjust x position when passing y threshold
      let currentKey = activeChannels[channel - 1]

      if (currentKey) { 
        let keyWidth = currentKey.key.offsets.width / 2
        let inStem = isInStem(currentKey)
        
        if (inStem) {
          const stemMode = getStemMode(currentKey.key.note)
          let offset = 0

          switch (stemMode.mode) {
            case 'left':
              offset = -7
              break;
            case 'center':
              offset = 0 
              break;
            case 'center-left':
              offset = (stemMode.xOffset / 2) - 5
              break;
            case 'center-right':
              offset = (stemMode.xOffset / 2) - 2
              break;
            case 'right':
              offset = (stemMode.xOffset / 2)
              break;
            default:

          }

          currentKey.axis.x = keyWidth + offset
        } else {
          // reset 
          currentKey.axis.x = keyWidth
          // currentKey.axis.z = 
        }
      }
    }
  }
}

function newKey(channel, sprite) {
  return {
    channel: channel,
    key: sprite // instance of Sprite
  }
}

function isActiveChannel(channel) {
  return !!activeChannels[channel-1]
}
function isActiveNote(zone, note) {
  return !!activeNotes[zone][note]
}

requestAnimationFrame(drawCanvas);

function drawCanvas(){
  if(isMIDI) { // MIDI Mode Draw
    Object.keys(activeNotes).forEach(z => {
      activeNotes[z].forEach(n => {
        if(n) {
          let noteData = n;
          // console.log('noteData', noteData);
          draw(noteData);
        }
      })
    })
  } else { // MPE Mode Draw
    Object.keys(activeChannels).forEach(c => {
      let channelData = activeChannels[c];
      // console.log('channelData', channelData.axis.x);
      draw(channelData);
    })
  }

  requestAnimationFrame(drawCanvas);
}
