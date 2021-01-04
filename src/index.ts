import { initBuffers, initWebgl, initShaderProgram, drawScene, clearScene } from './webgl/webglRenderer'
import { initPhys } from './phys-wasm';
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



const bootstrap = async () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
  const { initParticles, moveParticles, getColorArray, particlesToNewPoints, initParticlesWithPoints } = await initPhys();  

  if (!canvas || !canvas.getContext) {
    return;
  }
  
  const gl = initWebgl(canvas); 

  if(!gl) {
    return;
  }

  const initDataArrays = (amount: number, oldParticles?: Float32Array) => {
    const particles = new Float32Array(amount * ARRAY_ELEMENT_SIZE);
    const points = oldParticles ? particlesToNewPoints(oldParticles) : new Float32Array(amount * 2);
    const colors = getColorArray(amount * 3);

    return {
      particles,
      points,
      colors,
    }
  }

  const destroyParticles = () => {
    ({ particles, points, colors } = initDataArrays(PARTICLES_AMOUNT * SUBPARTICLES_AMOUNT, particles));
  
    initParticlesWithPoints(particles, points, SUBPARTICLES_AMOUNT);
  }

  let xPos, yPos;

  canvas.addEventListener('click', event => {
    const { width, height } = canvas.getBoundingClientRect();

    xPos = event.clientX / width * 2 - 1;
    yPos = 1 - event.clientY / height * 2;

    console.log("pos", xPos, yPos);

    runScene(xPos, yPos);
  })

  // MAIN ASYNC INIT
  let { particles, points, colors } = initDataArrays(PARTICLES_AMOUNT);
  
  const drawTick = () => {
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
    requestAnimationFrame(drawTick);
  }

  const draw = (x: number, y: number) => {
    initParticles(particles, x, y);
    requestAnimationFrame(drawTick);
  }


  const runScene = (x: number, y: number) => {
    draw(x, y); 

    const runDestructionTimer = initDestruction();

    runDestructionTimer(destroyParticles);
  }


}

bootstrap();

