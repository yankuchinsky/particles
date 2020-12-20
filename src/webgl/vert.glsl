precision lowp float;

attribute vec2 coordinate;

void main() {
  gl_Position = vec4(
    coordinate.x,
    coordinate.y,
    0,
    1
  );

  gl_PointSize = 1.0;
}