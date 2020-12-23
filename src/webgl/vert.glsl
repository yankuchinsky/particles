precision lowp float;

attribute vec2 coordinate;
attribute vec3 color;

varying lowp vec3 vColor;

void main() {
  gl_Position = vec4(
    coordinate.x,
    coordinate.y,
    0,
    1
  );

  gl_PointSize = 6.0;

  vColor = color;
}