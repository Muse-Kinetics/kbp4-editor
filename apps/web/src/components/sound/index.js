// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import AMSynth from './AMSynth'
import { convertRange } from '../../utilities'
// import midiToDecibel from '../../constants/midiToDecibel'

let activeChannels = []

export default function(midi) {
  let type = midi[0] & 0xf0,
      channel = midi[0] & 0xf

  switch (type) {
    case 128:
      // remove channel
      if(!!activeChannels[channel-1]) {
        activeChannels[channel-1].key.off();
        delete activeChannels[channel-1]
      }

      break;
    case 144:
      // add channel
      const note = midi[1], velocity = midi[2]

      if(!activeChannels[channel-1]) {
        activeChannels[channel-1] = newSynth(channel, new AMSynth(channel, note, velocity))
      }

      break;
    case 176:
      // cc data
      if(!!activeChannels[channel-1]) activeChannels[channel-1].cc = {
        number: midi[1],
        value: midi[2],
      }
      // if(!!activeChannels[channel-1]) activeChannels[channel-1].key.synth.modulation.frequency.value = convertRange(activeChannels[channel-1].cc.value, [0,127], [10, 127])
      break;
    case 208:
      // channel-pressure data
      if(!!activeChannels[channel-1]) activeChannels[channel-1].cp = {
        value: midi[1]
      }
      // if(!!activeChannels[channel-1]) activeChannels[channel-1].key.synth.volume.value = midiToDecibel[activeChannels[channel-1].cp.value]
      if(!!activeChannels[channel-1]) activeChannels[channel-1].key.synth.volume.rampTo(convertRange(activeChannels[channel-1].cp.value, [0,127], [-20, 0]), 0.1)
      // if(!!activeChannels[channel-1]) activeChannels[channel-1].key.synth.volume.value = convertRange(activeChannels[channel-1].cp.value, [0,127], [-20, 6])
      break;
    case 224:
      // pitch-bend
      if(!!activeChannels[channel-1]) activeChannels[channel-1].pb = {
        value: [midi[1], midi[2]],
      }
      break;
    default:

  }
}

function newSynth(channel, synth) {

  return {
    channel: channel,
    key: synth
  }
}

// cancel rAF if disabled in editor
//requestAnimationFrame(drawCanvas);
// check if array is empty every x seconds, if so set to activeChannels = []
// function drawCanvas(){
//   Object.keys(activeChannels).forEach(c => {
//     let channelData = activeChannels[c];
//     draw(channelData);
//   });
//
//   requestAnimationFrame(drawCanvas);
// }
