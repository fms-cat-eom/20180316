precision highp float;

uniform vec3 color;
uniform bool isPoint;

// ------

void main() {
  if ( isPoint && 0.5 < length( gl_PointCoord - 0.5 ) ) { discard; }
  gl_FragColor = vec4( color, 1.0 );
}