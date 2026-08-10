// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import keyPathsScaled from '../../constants/keyPathsScaled'
import offsets from '../../constants/keyOffsets'

export default class Particles {
  constructor(note){
    this.context = document.querySelector('canvas').getContext('2d')
    this.note = note
    this.data = offsets[note]
    this.radius = 2
    this.x = this.data.x
    this.y = this.data.y + this.data.height
    this._particleCount = 250
    this.particles = []
  }

  update(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
    for(let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
    }
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

    if (this.particles.length < this._particleCount) {
  		for(let i = 0; i < this._particleCount; i++) {
  			let p = new Particle(this.context, this.x, this.y);
  			this.particles.push(p);
  		}
  	}
    this.context.beginPath();
  	for(let i = this.particles.length - 1; i >= 0; i--) {
  		this.particles[i].draw();
  	}
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

class Particle {
	constructor(context, x, y){
		this.reset()
    this.context = context
    this.x = x
    this.y = y
	}
	reset() {
		this.radius = 1;
		this.explosionRadius = 2;
		this.angle = random(0 ,Math.PI * 2);
		this.color = 255;
		this.velocity = {
			x: Math.sin(this.angle) * this.explosionRadius,
			y: Math.cos(this.angle) * this.explosionRadius,
		};
		this.alpha = Math.random();
	}

	draw() {
		this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = `rgba(255, ${this.color}, ${this.color}, ${this.alpha})`;
    this.context.fill();
	}

	update() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.alpha -= 0.01;
		this.color = Math.abs(this.color - 5);
		if (this.alpha < 0) {
			this.reset();
		}
	}

}

function random(min,max) {
	return Math.random()*(max-min+1)+min;
}

/*
{
  "x": 0.48000001907348633,
  "y": 0.5083717703819275,
  "width": 30.0355281829834,
  "height": 205.6218719482422
}
*/
