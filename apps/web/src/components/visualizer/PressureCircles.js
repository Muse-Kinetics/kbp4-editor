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
    this.x = this.data.x
    this.y = this.data.y + this.data.height
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
    this.context.strokeStyle = "#00adef";
    this.context.lineWidth = .25;
    this.context.globalCompositeOperation = "source-over"
    // clip path
    this.context.save();
    this.context.clip(path);
    // draw point circle
    this.context.beginPath();
    this.context.arc(this.data.x + this.x, this.data.y + this.data.height - this.y, 1, 0, 2 * Math.PI, false);
    this.context.stroke();
    // draw pressure circle
    this.context.fillStyle = "#00adef06";
    this.context.beginPath();
    this.context.arc(this.data.x + this.x, this.data.y + this.data.height - this.y, this.radius, 0, 2 * Math.PI, false);
    this.context.stroke();
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

/*
{
  "x": 0.48000001907348633,
  "y": 0.5083717703819275,
  "width": 30.0355281829834,
  "height": 205.6218719482422
}
*/
