import { initBuffers, initWebgl, initShaderProgram, drawScene, clearScene } from './webgl/webglRenderer'
import { initPhys } from './ph/phys-wasm';
import { ProgramInfo } from "./types";

import * as VertexShader from './webgl/vert.glsl';
import * as FragmentShader from './webgl/frag.glsl';
import { ARRAY_ELEMENT_SIZE, PARTICLES_AMOUNT, SUBPARTICLES_AMOUNT } from './config';

const initDestruction = () => {
  let destroyTimer = 0;

  const destroyTimeout = (func: Function) => {
    setTimeout(() => {
      if (destroyTimer < 6) {
        destroyTimer += 1;
      } else {
        func();

        return;
      }

      destroyTimeout(func);
    }, 100);
  }
  
  return destroyTimeout;
}


const initCanvas = async () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
  const { initParticles, moveParticles, getColorArray, particlesToNewPoints, initParticlesWithPoints } = await initPhys();  
  const runDestructionTimer = initDestruction();

  if (!canvas || !canvas.getContext) {
    return;
  }

  let particles = new Float32Array(PARTICLES_AMOUNT * ARRAY_ELEMENT_SIZE);
  let points = new Float32Array(PARTICLES_AMOUNT * 2);

  initParticles(particles, 0, 0.5);

  let colors = getColorArray(PARTICLES_AMOUNT * 3);

  const gl = initWebgl(canvas); 

  const destroyParticles = () => {
    points = particlesToNewPoints(particles);
    particles = new Float32Array(PARTICLES_AMOUNT * ARRAY_ELEMENT_SIZE * SUBPARTICLES_AMOUNT);
    
    initParticlesWithPoints(particles, points, SUBPARTICLES_AMOUNT);
    
    colors = getColorArray(PARTICLES_AMOUNT * SUBPARTICLES_AMOUNT * 3);
  }

  if(!gl) {
    return;
  }

  const draw = () => {
    clearScene(gl);

    if(!particles.length) {
      return;
    }

    const shaderProgram = initShaderProgram(gl, VertexShader, FragmentShader);

    if (!shaderProgram) {
      return;
    }

    const programInfo: ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "coordinate"),
        vertexColor: gl.getAttribLocation(shaderProgram, "color"),
      },
    };
    
    const buffers = initBuffers(gl, particles, colors);
    drawScene(gl, programInfo, buffers, particles.length / 4);
    moveParticles(particles);
    requestAnimationFrame(draw);
  }

  draw();

  runDestructionTimer(destroyParticles);
}





initCanvas();

