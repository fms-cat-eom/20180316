precision highp float;

uniform vec3 color;

// ------

void main() {
  if ( 0.5 < length( gl_PointCoord - 0.5 ) ) { discard; }
  gl_FragColor = vec4( color, 1.0 );
}