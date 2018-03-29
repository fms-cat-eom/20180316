import MathCat from './libs/mathcat';
const glslify = require( 'glslify' );

// ------

let pathGrid = ( glCatPath ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  let layer = [];
  for ( let i = -3; i < 0; i ++ ) {
    layer.push( ( i + 0.5 ) * 0.05 );
  }
  let vboLayer = glCat.createVertexbuffer( layer );

  // ------

  glCatPath.add( {
    grid: {
      vert: glslify( './shader/path2dz.vert' ),
      frag: glslify( './shader/grid.frag' ),
      func: ( path, params ) => {
        glCat.attribute( 'z', vboLayer, 1, 1 );
        glCat.attribute( 'p', vboQuad, 2 );

        let matM = MathCat.mat4Identity();
        matM = MathCat.mat4Apply( MathCat.mat4ScaleXYZ( 100.0 ), matM );
        glCat.uniformMatrix4fv( 'matM', matM );
        
        glCat.uniform3fv( 'color', [ 1.0, 1.0, 1.0 ] );

        let ext = glCat.getExtension( "ANGLE_instanced_arrays" );
        ext.drawArraysInstancedANGLE( gl.TRIANGLE_STRIP, 0, 4, vboLayer.length );
      }
    },

    measure: {
      vert: glslify( './shader/path2d.vert' ),
      frag: glslify( './shader/measure.frag' ),
      func: ( path, params ) => {
        glCat.attribute( 'p', vboQuad, 2 );

        let matM = MathCat.mat4Identity();
        matM = MathCat.mat4Apply( MathCat.mat4ScaleXYZ( 100.0 ), matM );
        glCat.uniformMatrix4fv( 'matM', matM );
        
        glCat.uniform1f( 'phase1', params.phase1 );
        glCat.uniform1f( 'phase2', params.phase2 );
        glCat.uniform3fv( 'color', [ 1.0, 1.0, 1.0 ] );

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};

export default pathGrid;