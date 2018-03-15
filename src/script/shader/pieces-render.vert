#define HUGE 9E16
#define PI 3.14159265
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,m) (floor((i)/(m))*(m))

// ------

attribute vec2 computeUV;
attribute vec2 rect;

varying vec2 vUv;
varying float vLife;
varying float vSize;

uniform vec2 resolutionPcompute;
uniform mat4 matP;
uniform mat4 matV;

uniform sampler2D samplerPcompute;

// ------

mat2 rotate2D( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

void main() {
  vec2 puv = ( computeUV.xy + 0.5 ) / resolutionPcompute;
  vec2 dppix = vec2( 1.0 ) / resolutionPcompute;

  vec4 pos = texture2D( samplerPcompute, puv );
  vec4 vel = texture2D( samplerPcompute, puv + dppix * vec2( 1.0, 0.0 ) );

  pos.xy += vel.w * rect;

  vLife = pos.w;
  vSize = vel.w;

  vUv = 0.5 + 0.5 * rect;

  vec4 outPos = matP * matV * vec4( pos.xyz, 1.0 );
  gl_Position = outPos;
}