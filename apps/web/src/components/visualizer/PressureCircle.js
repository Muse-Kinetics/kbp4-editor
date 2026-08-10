// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import keyPathsScaled from '../../constants/keyPathsScaled'
import offsets from '../../constants/keyOffsets'

export default class PressureCircle {
  constructor(note){
    this.context = document.querySelector('canvas').getContext('2d')
    this.note = note
    this.data = offsets[note]
    this.radius = 2
    this.x = getCoords(this.data, this.radius).x
    this.y = getCoords(this.data, this.radius).y
  }

  update(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
  }

  draw() {
    let path = new Path2D(keyPathsScaled[this.note].d);
    // layered low-opacity fill for trailing effect
    this.context.fillStyle = 'rgba(51,51,51,0.15)';
    this.context.fill(path)
    // circle fill color and mode
    this.context.fillStyle = "#00adef";
    this.context.globalCompositeOperation = "source-over"
    // clip path
    this.context.save();
    this.context.clip(path);
    // draw circle
    this.context.beginPath();
    this.context.arc(this.data.x + this.x, this.data.y + this.data.height - this.y, this.radius, 0, 2 * Math.PI, false);
    this.context.closePath();
    this.context.fill();
    // restore from clip
    this.context.restore();
  }

  clear() {
    let path = new Path2D(keyPathsScaled[this.note].d);
    this.context.globalCompositeOperation = "destination-out"
    this.context.beginPath();
    path.closePath();
    this.context.fill(path)

  }
}

function getCoords(data, radius) {
  /*
  {
    "x": 0.48000001907348633,
    "y": 0.5083717703819275,
    "width": 30.0355281829834,
    "height": 205.6218719482422
  }
  */
  return {
    x: data.x,
    y: data.y + data.height
  }
}
