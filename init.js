var gl = null;

var astObjectList = [];
var programInfo = null;
var tex0 = null;

// Macierze transformacji
const m_World = mat4.create();
const m_View = mat4.create();
const m_Projection = mat4.create();

//Obsługa klawiszy
var keyStatus = [];
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(event) {
  keyStatus[event.key] = true;
}

function keyUpHandler(event) {
  keyStatus[event.key] = false;
}

//Bufory przechowujace dane o wierzchołkach
var astVBuffer = null;
var astCBuffer = null;
var astTBuffer = null;

//Inicjalizacja silnika gry
const init = () => {
  const canvas = document.querySelector('#gl-canvas');

  gl = canvas.getContext('webgl2', { antialias: false });

  if (gl === null) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.'
    );
    return;
  }

  //Tworzenie bufora z wierzchołkami
  astVBuffer = gl.createBuffer();
  astCBuffer = gl.createBuffer();
  astTBuffer = gl.createBuffer();

  //Pozycja wierzcholka (X Y Z)
  gl.bindBuffer(gl.ARRAY_BUFFER, astVBuffer);
  
  //Kolor wierzcholka (R G B A)
  gl.bindBuffer(gl.ARRAY_BUFFER, astCBuffer);
  
  //Mapowanie tekstury (S T)
  gl.bindBuffer(gl.ARRAY_BUFFER, astTBuffer);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);

  gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const vsSource = `

precision mediump float;

attribute vec3 in_Position;
attribute vec4 in_Color;
attribute vec2 in_TexCoord;

varying vec4 out_Color;
varying vec2 out_TexCoord;

uniform mat4 m_Projection, m_View, m_World;

void main() {
  gl_Position = m_Projection * m_View * m_World * vec4(in_Position.xyz, 1.0);
  out_Color = in_Color;
  out_TexCoord = in_TexCoord;
}
  `;

  const fsSource = `

precision mediump float;

varying vec4 out_Color;
varying vec2 out_TexCoord;

uniform sampler2D ast_Texture;

void main() {
  gl_FragColor = out_Color * texture2D(ast_Texture, out_TexCoord);
}
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'in_Position'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'in_Color'),
      vertexTexcoord: gl.getAttribLocation(shaderProgram, 'in_TexCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'm_Projection'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'm_View'),
      modelWorldMatrix: gl.getUniformLocation(shaderProgram, 'm_World'),
      TextureSampler: gl.getUniformLocation(shaderProgram, 'ast_Texture'),
    },
  };

  gl.useProgram(programInfo.program);
  gl.uniform1i(programInfo.uniformLocations.TextureSampler, 0);
  gl.activeTexture(gl.TEXTURE0);

  tex0 = astLoadTexture(null);
  gl.bindTexture(gl.TEXTURE_2D, tex0);

  astSceneInitiator();

  //Główna pętla gry
  setInterval(astGameLoop, 16.67);

  return;
};

class _Object {
  //Wydarzenie wywoływane podczas tworzenia instancji
  Create() {}

  //Wydarzenie wywoływane co każdą klatkę wideo (obliczenia i logika)
  Update() {}

  //Wydarzenie wywoływane co każdą klatkę wideo (rysowanie)
  Render() {}

  constructor(_x, _y, _z) {
    this.x = _x;
    this.y = _y;
    this.z = _z;

    this.layer = 0;

    this.Create();
  }
}

const astGameLoop = () => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  ///////////////////////////////////////////////////////////////////

  mat4.identity(m_Projection);
  mat4.identity(m_View);
  mat4.identity(m_World);
  astMatricesUpdate();

  astObjectList.forEach((e, i) => {
    e.order = i;
  });

  astObjectList.sort((a, b) => {
    if (a.obj.layer > b.obj.layer) {
      return 1;
    } else if (a.obj.layer < b.obj.layer) {
      return -1;
    } else {
      return 0;
    }
  });

  //Render
  astObjectList.forEach((e, i) => {
    e.obj.Render();
  });

  astObjectList.sort((a, b) => {
    if (a.obj.order > b.obj.order) {
      return 1;
    } else if (a.obj.order < b.obj.order) {
      return -1;
    } else {
      return 0;
    }
  });

  //Update
  astObjectList.forEach((e, i) => {
    e.obj.Update();
  });

  if (astObjectList.length > 0) {
    for (var i = astObjectList.length - 1; i > -1; i--) {
      if (astObjectList[i].removed === true) {
        astObjectList.splice(i);
      }
    }
  }
};

window.onload = init;
