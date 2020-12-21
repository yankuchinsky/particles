precision lowp float;

attribute vec2 coordinate;
attribute vec4 color;

varying lowp vec4 vColor;

void main() {
  gl_Position = vec4(
    coordinate.x,
    coordinate.y,
    0,
    1
  );

  gl_PointSize = 4.0;

  vColor = color;
}