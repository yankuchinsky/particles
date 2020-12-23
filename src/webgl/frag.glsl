precision lowp float;

varying lowp vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
  // gl_FragColor = vec4(0, 0.4, 0.24, 1.0);
}