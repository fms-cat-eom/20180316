import svgPath from './svg-path';
import MathCat from './libs/mathcat';
import VertPhaser from './vertphaser';
import * as opentype from 'opentype.js';
const glslify = require( 'glslify' );

// ------

let pathLofiPath = ( glCatPath, auto, callback ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let phasers;

  opentype.load( 'fonts/Orbitron-Black.ttf', function( error, font ) {
    if ( error ) {
      throw error;
    }
    
    let fontSize = 12.0;
    let text = 'Vec';
    let wid = font.getAdvanceWidth( text, fontSize );
    let path = font.getPath( text, 0, 0, fontSize ).toPathData();
    let vs = svgPath( path, { curveSegs: 8 } );
    phasers = vs.map( ( v ) => {
      for ( let i = 0; i < v.length / 2; i ++ ) {
        v[ i * 2 + 0 ] =  ( v[ i * 2 + 0 ] - wid / 2 );
        v[ i * 2 + 1 ] = -( v[ i * 2 + 1 ] + fontSize * 0.35 );
      }
      return new VertPhaser( v );
    } );

    callback();
  } );

  let vboPos = glCat.createVertexbuffer( false );

  // ------

  glCatPath.add( {
    lofipath: {
      vert: glslify( './shader/path-deformer.vert' ),
      frag: glslify( './shader/point-circle.frag' ),
      float: true,
      depthWrite: false,
      depthTest: false,
      func: ( path, params ) => {
        let matM = MathCat.mat4Identity();
        matM = MathCat.mat4Apply( MathCat.mat4ScaleXYZ( 0.4 ), matM );
        glCat.uniformMatrix4fv( 'matM', matM );
        
        glCat.uniform3fv( 'color', [ 1.0, 1.0, 1.0 ] );

        // ------

        phasers.map( phaser => {
          let begin = params.begin || 0.0;
          let segs = Math.max( 3, params.segs || 3 );
          let arr = phaser.lofi( begin, segs );

          glCat.setVertexbuffer( vboPos, arr, gl.DYNAMIC_DRAW );

          glCat.attribute( 'p', vboPos, 2 );

          glCat.uniform1f( 'deformAmp', auto( 'deformAmp' ) );
          glCat.uniform1f( 'deformFreq', auto( 'deformFreq' ) );
          glCat.uniform1f( 'deformOffset', auto( 'deformOffset' ) );

          glCat.uniform1i( 'isPoint', false );
          gl.drawArrays( gl.LINE_STRIP, 0, arr.length / 2 );

          glCat.uniform1i( 'isPoint', true );
          gl.drawArrays( gl.POINTS, 0, arr.length / 2 );
        } );
      }
    },
  } );
};

export default pathLofiPath;