import { renderWebgl } from './webgl/webglRenderer'

const initCanvas = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');

  if (!canvas || !canvas.getContext) {
    return;
  }

  renderWebgl(canvas);

}


initCanvas();

