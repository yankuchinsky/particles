import { init, initBuffers, initWebgl, initShaderProgram, drawScene } from './webgl/webglRenderer'
import { initPhys } from './ph/phys-wasm';
import { ProgramInfo } from "./types";

import * as VertexShader from './webgl/vert.glsl';
import * as FragmentShader from './webgl/frag.glsl';

const initCanvas = async () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
  const { moveParticles } = await initPhys();
  
  if (!canvas || !canvas.getContext) {
    return;
  }

  const { particles, colors } = await init();
  const gl = initWebgl(canvas); 
  
  if(!gl) {
    return;
  }

  gl.clearColor(1, 1, 1, 1);

  gl.clear(gl.COLOR_BUFFER_BIT);


  const draw = () => {
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
    drawScene(gl, programInfo, buffers);
    moveParticles(particles);
    requestAnimationFrame(draw);
  }

  draw();
}


initCanvas();

