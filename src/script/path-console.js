const glslify = require( 'glslify' );

// ------

let canvas = document.createElement( 'canvas' );
let context = canvas.getContext( '2d' );

// ------

let textWithBg = ( text, x, y ) => {
  context.font = '500 20px Wt-Position';
  context.textAlign = 'left';
  context.textBaseline = 'hanging';

  let mt = context.measureText( text );

  context.fillStyle = '#fff';
  context.fillRect( x - 4, y - 4, mt.width + 8, 20 );

  context.fillStyle = '#000';
  context.fillText( text, x, y );
};

let textBottom = ( text, size, x, y ) => {
  context.font = '900 ' + size + 'px Helvetica Neue';
  context.textAlign = 'right';
  context.textBaseline = 'alphabetic';

  context.fillStyle = '#fff';
  context.fillText( text, x, y );
};

// ------

let pathConsole = ( glCatPath, width, height ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let w = canvas.width = width;
  let h = canvas.height = height;

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );
  let texture = glCat.createTexture();

  // ------

  glCatPath.add( {
    console: {
      vert: glslify( './shader/quad.vert' ),
      frag: glslify( './shader/return-yinvert.frag' ),
      float: true,
      blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
      depthWrite: false,
      depthTest: false,
      func: ( path, params ) => {
        context.clearRect( 0, 0, w, h );

        textWithBg( 'RANDOM F*%#ING NUMBER: ' + ( 256.0 * Math.random() ).toFixed( 3 ), 10, 10 );
        textWithBg( 'CAMERA X: ' + params.cameraX.toFixed( 3 ), 10, 40 );
        textWithBg( 'CAMERA Y: ' + params.cameraY.toFixed( 3 ), 10, 70 );
        textWithBg( 'CAMERA Z: ' + params.cameraZ.toFixed( 3 ), 10, 100 );

        textBottom( params.time.toFixed( 3 ), 30, width - 10, height - 80 );
        textBottom( 'undefined', 30, width - 10, height - 50 );
        textBottom( '[Placeholder]', 40, width - 10, height - 10 );

        glCat.setTexture( texture, canvas );

        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniformTexture( 'sampler0', texture, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};

export default pathConsole;