#define saturate(i) clamp(i,0.,1.)

precision highp float;

varying vec3 vPos;

uniform vec3 color;

// ------

void main() {
  float intrv = 5.0;
  vec2 p = mod( vPos.xy, intrv ) - intrv / 2.0;

  float a = 1.0;
  a *= smoothstep( 0.05, 0.00, min( abs( p.x ), abs( p.y ) ) );
  a *= smoothstep( 0.40, 0.39, max( abs( p.x ), abs( p.y ) ) );

  if ( a == 0.0 ) { discard; }
  gl_FragColor = vec4( color, 0.1 * saturate( a ) );
}