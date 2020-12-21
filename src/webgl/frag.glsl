precision lowp float;

varying lowp vec4 vColor;

void main() {
  gl_FragColor = vColor;
  // gl_FragColor = vec4(0, 0, 0, 1);
}