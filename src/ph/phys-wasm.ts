const wasmModule = import("wasm-phys");


export const initPhys = async () => {
  
  const wasm = await wasmModule;

  return {
    initParticles: wasm.initParticles, 
    moveParticles: wasm.moveParticles,
    getColor: wasm.getColor,
    getColorArray: wasm.getColorArray,
  }
    
}