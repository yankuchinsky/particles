import { ProgramInfo } from "../types";

export const initBuffers = (gl: WebGLRenderingContext, particles: Float32Array, colors: Float32Array) => {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles), gl.DYNAMIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


  return {
    position: positionBuffer,
    color: colorBuffer,
  };
};

export const clearScene = (gl: WebGLRenderingContext) => {
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export const drawScene = (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: WebGLBuffer,
  pointsCount: number,
) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  clearScene(gl);

  {
    gl.bindBuffer(gl.ARRAY_BUFFER, (<any>buffers).position);
    const attribLocation = gl.getAttribLocation(<WebGLProgram>programInfo.program, 'coordinate');
    gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(attribLocation);
  }

  {
    gl.bindBuffer(gl.ARRAY_BUFFER, (<any>buffers).color);
    const attribColor = gl.getAttribLocation(<WebGLProgram>programInfo.program, 'color');
    gl.vertexAttribPointer(attribColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribColor);
  }

  gl.useProgram(programInfo.program);
  
  gl.drawArrays(gl.POINTS, 0 , pointsCount);
};



export const initWebgl = (canvas: HTMLCanvasElement) => {
  const webglConfig = {
    alpha: false,
    antialias: false
  }

  const gl: WebGLRenderingContext | null  = <WebGLRenderingContext | null>canvas.getContext("webgl", webglConfig);

  if (!gl) {
    return;
  }

  return gl;
}

export const initProgram = (gl: WebGLRenderingContext) => {
  const program = gl.createProgram();

  if(!program) {
    console.log('Error while creating program');
    
    return;
  }

  return program;
}

export const createShader = ( gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!status) {
    console.log("Can't compile shader ", gl.getShaderInfoLog(shader));

    gl.deleteShader(shader);

    return null;
  }

  return shader;

}


export const initShaderProgram = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): WebGLProgram | null => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    console.log("Can't load shader");
    return null;
  }

  const shaderProgram = gl.createProgram();
  
  if (!shaderProgram) {
    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);

  gl.linkProgram(shaderProgram);

  const status = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);

  if (!status) {
    console.log(
      "Unable to init the shader program: ",
      gl.getProgramInfoLog(shaderProgram)
    );

    return null;
  }

  return shaderProgram;
};


