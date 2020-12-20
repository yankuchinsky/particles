import {ARRAY_ELEMENT_SIZE, PARTICLES_AMOUNT} from '../config'
import { initPhys } from '../ph/phys-wasm';


import * as VertexShader from './vert.glsl';
import * as FragmentShader from './frag.glsl';


export const renderWebgl = async (canvas: HTMLCanvasElement) => {
  const particles = new Float32Array(PARTICLES_AMOUNT * ARRAY_ELEMENT_SIZE);

  const webglConfig = {
    alpha: false,
    antialias: false
  }

  const gl: WebGLRenderingContext | null  = <WebGLRenderingContext | null>canvas.getContext("webgl", webglConfig);

  if (!gl) {
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.clearColor(0, 0, 0, 1);

  const program = gl.createProgram();

  if(!program) {
    console.log('Error while creating program');
    
    return;
  }

  {
    const shader = gl.createShader(gl.VERTEX_SHADER);

    if(!shader) {
      console.log('Error while creating vertex shader');
      
      return;
    }

    gl.shaderSource(shader, VertexShader);
    gl.compileShader(shader);

    console.log(gl.getShaderInfoLog(shader));

    gl.attachShader(program, shader);
  }

  {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);

    if(!shader) {
      console.log('Error while creating vertex shader');
      
      return;
    }

    gl.shaderSource(shader, FragmentShader);
    gl.compileShader(shader);

    console.log(gl.getShaderInfoLog(shader));

    gl.attachShader(program, shader);
  }

  gl.linkProgram(program);
  gl.useProgram(program);

  {
    const attribLocation = gl.getAttribLocation(program, 'coordinate');
    gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(attribLocation);

  }

  const { initParticles, moveParticles } = await initPhys();
  
  initParticles(particles, 0, 0);
  
  gl.viewport(0, 0, canvas.width , canvas.height);
  
  const draw = () => {
    moveParticles(particles);
  
    gl.bufferData(gl.ARRAY_BUFFER, particles.subarray(0, PARTICLES_AMOUNT * ARRAY_ELEMENT_SIZE), gl.DYNAMIC_DRAW);
    gl.clearColor(1, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.POINTS, 0 , PARTICLES_AMOUNT);

    requestAnimationFrame(draw);
  }
  
  draw();
} 