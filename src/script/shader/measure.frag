#define saturate(i) clamp(i,0.,1.)

precision highp float;

varying vec3 vPos;

uniform float time;
uniform vec3 color;
uniform float phase1;
uniform float phase2;

// ------

void main() {
  float a = 0.0;

  // line
  a += (
    smoothstep( 0.05, 0.04, abs( abs( vPos.y ) - 3.0 ) )
  );

  float scroll = vPos.y < 0.0 ? time : -time;

  // dot1
  {
    float d = mod( vPos.x - 0.1 + scroll, 0.2 ) - 0.1;
    a += (
      smoothstep( 0.03, 0.02, abs( d ) )
      * smoothstep( 2.9, 2.89, abs( vPos.y ) )
      * smoothstep( 2.9, 2.91, abs( vPos.y ) + 0.1 * phase2 )
    );
  }

  // dot2
  {
    float d = mod( vPos.x - 0.5 + scroll, 1.0 ) - 0.5;
    a += (
      smoothstep( 0.03, 0.02, abs( d ) )
      * smoothstep( 2.9, 2.89, abs( vPos.y ) )
      * smoothstep( 2.9, 2.91, abs( vPos.y ) + 0.2 * phase2 )
    );
  }

  a *= smoothstep( 0.0, -0.01, abs( vPos.x ) - 6.02 * phase1 );

  if ( a == 0.0 ) { discard; }
  gl_FragColor = vec4( color, 0.3 * saturate( a ) );
}