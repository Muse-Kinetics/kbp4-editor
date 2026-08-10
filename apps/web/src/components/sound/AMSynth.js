// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import Tone from 'tone'

// create: midi note

Tone.context.lookAhead = 0
/*
let AMSynthDefaults = {
	"harmonicity" : 2.5,
	"oscillator" : {
		"type" : "fatsawtooth"
	},
	"envelope" : {
		"attack" : 0.1,
		"decay" : 0.2,
		"sustain" : 0.2,
		"release" : 0.3
	},
	"modulation" : {
		"type" : "square"
	},
	"modulationEnvelope" : {
		"attack" : 0.5,
		"decay" : 0.01
	}
}
*/
const polySynth = new Tone.PolySynth(16, Tone.AMSynth).toMaster();
// console.log('Tone.PolySynth', polySynth);

export default class AMSynth {
  constructor(channel, note, velocity) {
    // this.synth = new Tone.AMSynth(AMSynthDefaults).toMaster();
    // this.synth = new Tone.AMOscillator(Tone.Midi(note).toFrequency(), "square", "square").toMaster();
    this.synth = polySynth.voices[channel]
    this.synth.volume.rampTo(-Infinity, 0.1);
    this.synth.triggerAttack(Tone.Midi(note).toFrequency(), Tone.immediate(), 127);
		console.log('this.synth', this.synth);
		// this.synth.start()
    // add other routing
  }

  off() {
    this.synth.triggerRelease()
    // this.synth.stop()
    // this.synth.dispose()
    // setTimeout(() => this.synth.dispose(), 1000)
  }
}

/*
440×2 𝑛𝑜𝑡𝑒−69/12.0 + 𝑝𝑖𝑡𝑐ℎ𝑏𝑒𝑛𝑑−8192/4096×12

pitch = round(log2(.93)*12*8192/2);
*/
