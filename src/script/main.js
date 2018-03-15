import xorshift from './libs/xorshift';
import Tweak from './libs/tweak';
import GLCat from './libs/glcat';
import GLCatPath from './libs/glcat-path-gui';
import MathCat from './libs/mathcat';
import step from './libs/step';

import pathLofiPath from './path-lofipath';
import pathPieces from './path-pieces';
import pathPostfx from './path-postfx';
import pathConsole from './path-console';
import pathGrid from './path-grid';

let glslify = require( 'glslify' );

// ------

xorshift( 326789157890 );

// ------

let width = canvas.width = 480;
let height = canvas.height = 480;

let renderA = document.createElement( 'a' );

let saveFrame = () => {
  renderA.href = canvas.toDataURL();
  renderA.download = ( '0000' + totalFrame ).slice( -5 ) + '.png';
  renderA.click();
};

// ------

let gl = canvas.getContext( 'webgl' );
gl.enable( gl.CULL_FACE );

let glCat = new GLCat( gl );

glCat.getExtension( 'OES_texture_float', true );
glCat.getExtension( 'OES_texture_float_linear', true );
glCat.getExtension( 'EXT_frag_depth', true );
glCat.getExtension( 'ANGLE_instanced_arrays', true );

let glCatPath = new GLCatPath( glCat, {
  el: divPath,
  canvas: canvas,
  stretch: true
} );

// ------

let tweak = new Tweak( divTweak );

// ------

let totalFrame = 0;
let init = false;

let automaton = new Automaton( {
  gui: divAutomaton,
  fps: 60,
  data: `
  {"v":"1.1.1","length":3,"resolution":1000,"params":{"cameraPosX":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.5,"value":0,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":0.3685084541062791,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":1.625,"value":-0.32850241545893955,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":2,"value":0.3318236714975846,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":0,"mode":4,"params":{"rate":2000,"damp":1},"mods":[false,false,false,false]}],"pathBegin":[{"time":0,"value":0.2,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":3,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"pathSegs":[{"time":0,"value":30.000000000000007,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1.25,"value":4,"mode":4,"params":{"rate":30,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":30,"mode":4,"params":{"rate":30,"damp":1},"mods":[false,false,false,false]}],"deformAmp":[{"time":0,"value":5,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1.25,"value":5.744800003243596,"mode":4,"params":{"rate":50,"damp":1},"mods":[false,false,false,false]},{"time":2.4314868804664727,"value":0,"mode":4,"params":{"rate":91,"damp":1},"mods":[false,false,false,false]},{"time":2.685131195335277,"value":1.7939176042416891,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":5,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"deformFreq":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1.25,"value":0.15161574064757133,"mode":4,"params":{"rate":50,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":1,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"deformOffset":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":3,"value":1.0014573039186314,"mode":1,"params":{},"mods":[false,false,false,false]}],"cameraPosY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.75,"value":0,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":1.25,"value":0.40126811594202927,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":1.875,"value":-0.735960144927537,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":2,"value":0.4012681159420284,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":0,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]}],"cameraPosZ":[{"time":0,"value":10,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1.25,"value":18.080519192055664,"mode":4,"params":{"rate":250,"damp":1},"mods":[false,false,false,false]},{"time":2,"value":9.572463768115943,"mode":4,"params":{"rate":250,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":10,"mode":4,"params":{"rate":5000,"damp":1},"mods":[false,false,false,false]}],"glitch":[{"time":0,"value":0.3650542009991148,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":2.5,"value":0,"mode":4,"params":{"rate":190,"damp":1},"mods":[false,false,{"freq":1,"amp":0.024,"reso":8,"recursion":4,"seed":20.07},{"freq":19}]},{"time":3,"value":0.31146654065536417,"mode":2,"params":{},"mods":[{"velocity":0},false,false,false]}],"glitchSeed":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.04054054054054054,"value":0.053140096618357446,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.4723032069970846,"value":0.18357487922705318,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":2.5509810101646835,"value":0.7248830012077294,"mode":1,"params":{},"mods":[false,false,false,{"freq":31}]},{"time":2.921,"value":0.8840579710144932,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":3,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"measurePhase1":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1.25,"value":5.551115123125783e-17,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":1,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"measurePhase2":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1.5801158301158305,"value":0.004830917874396101,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]},{"time":3,"value":1,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}]},"gui":{"snap":{"enable":true,"bpm":"60","offset":"0"}}}
`
} );
let auto = automaton.auto;

// ------

let cameraPos = [ 0.0, 0.0, 10.0 ];
let cameraTar = [ 0.0, 0.0, 0.0 ];
let cameraRoll = 0.0;
let cameraFov = 70.0;

let cameraNear = 0.1;
let cameraFar = 100.0;

let lightPos = [ 10.0, 8.0, 10.0 ];

let matP;
let matV;
let matPL;
let matVL;

let updateMatrices = () => {
  cameraPos[ 0 ] = auto( 'cameraPosX' );
  cameraPos[ 1 ] = auto( 'cameraPosY' );
  cameraPos[ 2 ] = auto( 'cameraPosZ' );

  matP = MathCat.mat4Perspective( cameraFov, cameraNear, cameraFar );
  matV = MathCat.mat4LookAt( cameraPos, cameraTar, [ 0.0, 1.0, 0.0 ], cameraRoll );

  matPL = MathCat.mat4Perspective( cameraFov, cameraNear, cameraFar );
  matVL = MathCat.mat4LookAt( lightPos, cameraTar, [ 0.0, 1.0, 0.0 ], 0.0 );
};
updateMatrices();

// ------

let mouseX = 0.0;
let mouseY = 0.0;

canvas.addEventListener( 'mousemove', ( event ) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
} );

// ------

let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

// ------

let bgColor = [ 0.01, 0.01, 0.01, 1.0 ];

// ------

glCatPath.setGlobalFunc( () => {
  glCat.uniform1i( 'init', init );
  glCat.uniform1f( 'time', automaton.time );
  glCat.uniform1f( 'deltaTime', automaton.deltaTime );

  glCat.uniform1f( 'totalFrame', totalFrame );
  glCat.uniform2fv( 'mouse', [ mouseX, mouseY ] );

  glCat.uniform3fv( 'cameraPos', cameraPos );
  glCat.uniform3fv( 'cameraTar', cameraTar );
  glCat.uniform1f( 'cameraRoll', cameraRoll );
  glCat.uniform1f( 'cameraFov', cameraFov );
  glCat.uniform1f( 'cameraNear', cameraNear );
  glCat.uniform1f( 'cameraFar', cameraFar );
  glCat.uniform3fv( 'lightPos', lightPos );

  glCat.uniformMatrix4fv( 'matP', matP );
  glCat.uniformMatrix4fv( 'matV', matV );
  glCat.uniformMatrix4fv( 'matPL', matPL );
  glCat.uniformMatrix4fv( 'matVL', matVL );
  glCat.uniform4fv( 'bgColor', bgColor );
} );

glCatPath.add( {
  return: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.ONE, gl.ZERO ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    func: ( path, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  inspector: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/inspector.frag' ),
    blend: [ gl.ONE, gl.ZERO ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    func: ( path, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform3fv( 'circleColor', [ 1.0, 1.0, 1.0 ] );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  'target': {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bg.frag' ),
    blend: [ gl.ONE, gl.ZERO ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    framebuffer: true,
    float: true,
    depthWrite: false,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
} );

// ------

let updateUI = () => {
  let now = new Date();
  let deadline = new Date( 2018, 2, 16, 0, 0 );

  divCountdown.innerText = 'Deadline: ' + Math.floor( ( deadline - now ) / 1000 );
};

// ------

let update = () => {
  if ( !tweak.checkbox( 'play', { value: true } ) ) {
    setTimeout( update, 100 );
    return;
  }

  automaton.update();

  updateUI();
  updateMatrices();

  // ------

  glCatPath.begin();

  glCatPath.render( 'target' );

  glCatPath.render( 'piecesComputeReturn' );
  glCatPath.render( 'piecesCompute' );

  glCatPath.render( 'lofipath', {
    target: glCatPath.fb( 'target' ),
    width: width,
    height: height,
    begin: auto( 'pathBegin' ),
    segs: auto( 'pathSegs' )
  } );

  glCatPath.render( 'piecesRender', {
    target: glCatPath.fb( 'target' ),
    width: width,
    height: height
  } );

  glCatPath.render( 'console', {
    target: glCatPath.fb( 'target' ),
    width: width,
    height: height,
    time: automaton.time,
    frame: automaton.frame,
    cameraX: cameraPos[ 0 ],
    cameraY: cameraPos[ 1 ],
    cameraZ: cameraPos[ 2 ]
  } );

  glCatPath.render( 'measure', {
    target: glCatPath.fb( 'target' ),
    width: width,
    height: height,
    phase1: auto( 'measurePhase1' ),
    phase2: auto( 'measurePhase2' )
  } );

  glCatPath.render( 'grid', {
    target: glCatPath.fb( 'target' ),
    width: width,
    height: height
  } );

  glCatPath.render( 'glitch', {
    input: glCatPath.fb( 'target' ).texture,
    width: width,
    height: height,
    amp: auto( 'glitch' ),
    seed: auto( 'glitchSeed' )
  } );

  glCatPath.render( 'post', {
    target: GLCatPath.nullFb,
    input: glCatPath.fb( 'glitch' ).texture,
    width: width,
    height: height,
  } );

  glCatPath.end();

  init = false;
  totalFrame ++;

  // ------

  if ( tweak.checkbox( 'save', { value: false } ) ) {
    saveFrame();
  }

  requestAnimationFrame( update );
}


step( {
  0: ( step ) => {
    pathLofiPath( glCatPath, auto, step );
    pathPostfx( glCatPath, width, height );
    pathConsole( glCatPath, width, height );
    pathPieces( glCatPath, automaton );
    pathGrid( glCatPath );
  },

  1: ( step ) => {
    update();
  }
} );

// ------

window.addEventListener( 'keydown', ( _e ) => {
  if ( _e.which === 27 ) {
    tweak.checkbox( 'play', { set: false } );
  }
} );
