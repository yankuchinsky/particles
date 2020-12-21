export type ProgramInfo = {
  program: WebGLProgram | null;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
};
