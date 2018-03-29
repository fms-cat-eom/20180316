import MathCat from './libs/mathcat';
const glslify = require( 'glslify' );

// ------

let pathPostfx = ( glCatPath, width, height ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  // ------

  glCatPath.add( {
    fxaa: {
      width: width,
      height: height,
      vert: glslify( './shader/quad.vert' ),
      frag: glslify( './shader/fxaa.frag' ),
      clear: [ 0.0, 0.0, 0.0, 1.0 ],
      framebuffer: true,
      float: true,
      blend: [ gl.ONE, gl.ZERO ],
      func: ( path, params ) => {
        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniformTexture( 'sampler0', params.input, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  
    post: {
      width: width,
      height: height,
      vert: glslify( './shader/quad.vert' ),
      frag: glslify( './shader/post.frag' ),
      blend: [ gl.ONE, gl.ZERO ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      func: ( path, params ) => {
        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniformTexture( 'sampler0', params.input, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  
    glitch: {
      width: width,
      height: height,
      vert: glslify( './shader/quad.vert' ),
      frag: glslify( './shader/glitch.frag' ),
      blend: [ gl.ONE, gl.ZERO ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      func: ( path, params ) => {
        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniform1f( 'amp', params.amp );
        glCat.uniform1f( 'seed', params.seed );
        glCat.uniformTexture( 'sampler0', params.input, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};

export default pathPostfx;