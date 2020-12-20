import { ARRAY_ELEMENT_SIZE } from '../config'

export const initParticles = (p: Float32Array, x: number, y: number, rate = 1000) => {
  for(let i = 0; i < p.length; i += ARRAY_ELEMENT_SIZE) {
    p[i] = x;
    p[i + 1] = y;
    const d = Math.sqrt(Math.random()) * 10;
    const ang = Math.random() * Math.PI * 20;
    p[i + 2] = Math.cos(ang) * d / rate;
    p[i + 3] = Math.sin(ang) * d / rate; 
  }
}

export const moveParticles = (p: Float32Array) => {
  for(let i = 0; i < p.length; i += ARRAY_ELEMENT_SIZE) {
    p[i] += p[i + 2];
    p[i + 1] += p[i + 3];
   
    p[i + 3] -= 0.0001;
  }

}