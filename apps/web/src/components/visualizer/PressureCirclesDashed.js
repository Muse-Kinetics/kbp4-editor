// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import keyPathsScaled from '../../constants/keyPathsScaled'
import offsets from '../../constants/keyOffsets'

export default class PressureCircle {
  constructor(key, MIDINote){
    this.context = document.querySelector('canvas').getContext('2d')
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(devicePixelRatio, devicePixelRatio)
    this.key = key // svg key index
    this.MIDINote = MIDINote
    this.note = keyPathsScaled[this.key].note
    this.offsets = offsets[key]
    this.radius = 2
    this.x = this.offsets.x
    this.y = this.offsets.y + this.offsets.height
  }

  update(x, y, radius, zone, stemMode) {
    this.x = x
    this.y = y
    this.radius = radius
    this.zone = zone
    this.stemMode = stemMode
  }

  updateScale() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(devicePixelRatio, devicePixelRatio)
    console.log(`>> K-Board Pro 4 Editor: update pixel density ratio to: ${devicePixelRatio}`);
  }

  draw() {
    let path = new Path2D(keyPathsScaled[this.key].d);
    // layered low-opacity fill for trailing effect
    this.context.fillStyle = 'rgba(51,51,51,0.15)';
    this.context.fill(path)
    // circle fill color and mode
    this.context.fillStyle = this.zone === 0 ? "#00adef" : "#b37bca";
    this.context.strokeStyle = this.zone === 0 ? "#00adef" : "#b37bca";
    this.context.lineWidth = .25;
    this.context.globalCompositeOperation = "source-over"
    // clip path
    this.context.save();
    this.context.clip(path);
    // draw point circle
    this.context.beginPath();
    this.context.setLineDash([]);
    this.context.arc(this.offsets.x + this.x, this.offsets.y + this.offsets.height - this.y - this.radius, 1, 0, 2 * Math.PI, false);
    this.context.stroke();
    // draw pressure circle
    this.context.fillStyle = this.zone === 0 ? "#00adef06" : "#b37bca06";
    this.context.beginPath();
    this.context.setLineDash([3, 5]);
    this.context.arc(this.offsets.x + this.x, this.offsets.y + this.offsets.height - this.y - this.radius, this.radius, 0, 2 * Math.PI, false);
    this.context.stroke();
    this.context.fill();
    // restore from clip
    this.context.restore();
  }

  clear() {
    let path = new Path2D(keyPathsScaled[this.key].d);
    this.context.globalCompositeOperation = "destination-out"
    this.context.beginPath();
    path.closePath();
    this.context.fill(path)

  }
}