// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export function setCanvasDimensions(){
  const canvasContainer = document.querySelector('.k-board-pro-4-keys'),
        canvas = document.querySelector('canvas')

  canvas.width = canvasContainer.offsetWidth * devicePixelRatio
  canvas.height = canvasContainer.offsetHeight * devicePixelRatio
}

export function getMIDIRange(value, range, round = true){
  const r = convertRange(value, [0, 127], [range[0], range[1]]);

  return (round) ? Math.floor(r) : r;
}

export function getRange(value, range, round = false){
  const r = convertRange(value, [range[0], range[1]], [range[2], range[3]]);

  return (round) ? Math.floor(r) : r;
}

export function convertRange( value, r1, r2 ) { // r1 = original range, r2 = new range
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

export function parsePitchBend(bitArr){
  let lsb = bitArr[0], msb = bitArr[1];
  return (msb << 7) | lsb;
}

export function convert8to16(bitArr, divider){
  let lsb = bitArr[0], msb = bitArr[1];
  return (((msb << 8) + lsb) / divider).toFixed(2);
}

export function pixelRatioScale(data) {
	return Object.keys(data).reduce((o,p,i) => {
		o[p] = data[p] * devicePixelRatio
		return o
	}, {})
}

export function getAllIndexes(arr, val) {
    let axis = ['x', 'y', 'z'], indexes = [], i;
    for(i = 0; i < arr.length; i++){
      if (arr[i] === val){
        indexes.push(axis[i])
      }
    }

    return indexes;
}

export function isInStem(currentKey){
  const inStemThreshold = 65
  return (currentKey.keyType === 'white' && currentKey.axis.y > inStemThreshold) ? true : false
}

const stemModes = [
  {// C, F
    mode: 'left',
    radiusScaler: 0.5,
    xOffset: 0
  },
  {// D 'center'
    mode: 'center',
    radiusScaler: 0.5,
    xOffset: 8
  },
  {// G 'center-left'
    mode: 'center-left',
    radiusScaler: 0.5,
    xOffset: 6
  },
  {// A 'center-right'
    mode: 'center-right',
    radiusScaler: 0.5,
    xOffset: 10
  },
  {// E, B 'right'
    mode: 'right',
    radiusScaler: 0.5,
    xOffset: 14
  }
]

export function getStemMode(note) {
  let mode

  if(/^([CF])+/g.test(note)) { // left
    mode = 0
  } else if (/^([D])+/g.test(note)) { // center
    mode = 1
  } else if (/^([G])+/g.test(note)) { // center left
    mode = 2
  } else if (/^([A])+/g.test(note)) { // center right
    mode = 3
  } else if (/^([EB])+/g.test(note)) { // right
    mode = 4
  }
  return stemModes[mode]
}
