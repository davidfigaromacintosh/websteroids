// Tworzenie instancji na scenie
const astInstanceCreate = (_class, x, y, z) => {
  //let _instance = ;
  astObjectList.push({ obj: new _class(x, y, z), removed: false });
  return astObjectList[astObjectList.length - 1].obj;
};

// Usuwanie instancji ze sceny
const astInstanceDestroy = (reference) => {
  if (astObjectList.length > 0) {
    for (var i = astObjectList.length - 1; i > -1; i--) {
      if (astObjectList[i].obj == reference) {
        astObjectList[i].removed = true;
      }
    }
  }
};

// Narysuj trójkąt
const astDrawTriangle = (
  x1,
  y1,
  z1,
  x2,
  y2,
  z2,
  x3,
  y3,
  z3,
  s1,
  t1,
  s2,
  t2,
  s3,
  t3,
  r,
  g,
  b,
  a
) => {
  const positions = [x1, y1, z1, x2, y2, z2, x3, y3, z3];

  const colors = [r, g, b, a, r, g, b, a, r, g, b, a];

  const texcoords = [s1, t1, s2, t2, s3, t3];

  gl.bindBuffer(gl.ARRAY_BUFFER, astVBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, astCBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, astTBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

// Narysuj linie
const astDrawLine = (x1, y1, z1, x2, y2, z2, r, g, b, a) => {
  const positions = [x1, y1, z1, x2, y2, z2];

  const colors = [r, g, b, a, r, g, b, a];

  const texcoords = [0, 0, 1, 1];

  gl.bindBuffer(gl.ARRAY_BUFFER, astVBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, astCBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, astTBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

  gl.drawArrays(gl.LINES, 0, 2);
};

// Aktualizuj macierze transformacji
const astMatricesUpdate = () => {
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    m_Projection
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    m_View
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelWorldMatrix,
    false,
    m_World
  );
};

function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];
  const objColors = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [objPositions, objTexcoords, objNormals, objColors];

  // same order as `f` indices
  let webglVertexData = [
    [], // positions
    [], // texcoords
    [], // normals
    [], // colors
  ];

  const materialLibs = [];
  const geometries = [];
  let geometry;
  let groups = ['default'];
  let material = 'default';
  let object = 'default';

  const noop = () => {};

  function newGeometry() {
    // If there is an existing geometry and it's
    // not empty then start a new one.
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
  }

  function setGeometry() {
    if (!geometry) {
      const position = [];
      const texcoord = [];
      const normal = [];
      const color = [];
      webglVertexData = [position, texcoord, normal, color];
      geometry = {
        object,
        groups,
        material,
        data: {
          position,
          texcoord,
          normal,
          color,
        },
      };
      geometries.push(geometry);
    }
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
      // if this is the position index (index 0) and we parsed
      // vertex colors then copy the vertex colors to the webgl vertex color data
      if (i === 0 && objColors.length > 1) {
        geometry.data.color.push(...objColors[index]);
      }
    });
  }

  const keywords = {
    v(parts) {
      // if there are more than 3 values here they are vertex colors
      if (parts.length > 3) {
        objPositions.push(parts.slice(0, 3).map(parseFloat));
        objColors.push(parts.slice(3).map(parseFloat));
      } else {
        objPositions.push(parts.map(parseFloat));
      }
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop, // smoothing group
    mtllib(parts, unparsedArgs) {
      // the spec says there can be multiple filenames here
      // but many exist with spaces in a single filename
      materialLibs.push(unparsedArgs);
    },
    usemtl(parts, unparsedArgs) {
      material = unparsedArgs;
      newGeometry();
    },
    g(parts) {
      groups = parts;
      newGeometry();
    },
    o(parts, unparsedArgs) {
      object = unparsedArgs;
      newGeometry();
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword); // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  // remove any arrays that have no entries.
  for (const geometry of geometries) {
    geometry.data = Object.fromEntries(
      Object.entries(geometry.data).filter(([, array]) => array.length > 0)
    );
  }

  return {
    geometries,
    materialLibs,
  };
}

async function astLoadModel(filename) {
  const res = await fetch(filename);
  const tex = await res.text();
  const mdl = parseOBJ(tex);

  var modelobj = {
    vertices: [],
    colors: [],
    texcoords: [],
    normals: [],
  };

  mdl.geometries.forEach((e, i) => {
    modelobj.vertices = [...modelobj.vertices, ...e.data.position];
    modelobj.colors = Array.from(
      { length: (4 * modelobj.vertices.length) / 3 },
      (_, i) => 1
    );
    modelobj.texcoords = [...modelobj.texcoords, ...e.data.texcoord];
    modelobj.normals = [...modelobj.normals, ...e.data.normal];
  });

  return modelobj;
}

const astDrawModel = (model) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, astVBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.vertices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, astCBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.colors),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, astTBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.texcoords),
    gl.STATIC_DRAW
  );

  gl.drawArrays(gl.TRIANGLES, 0, model.vertices.length / 3);
};

const astLoadTexture = (filename) => {
  const _texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, _texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255])
  );

  if (filename === null) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return _texture;
  } else {
    const image = new Image();

    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, _texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    image.src = filename;

    return _texture;
  }
};

function initShaderProgram(gl, vsSource, fsSource) {
  // Załaduj shadery
  const _vertex = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const _fragment = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Stwórz program zawierający shadery vertex i fragment
  const _program = gl.createProgram();
  gl.attachShader(_program, _vertex);
  gl.attachShader(_program, _fragment);
  gl.linkProgram(_program);

  // Wyświetl komunikacje o błędzie jeśli kompilacja shaderów zawiodła
  if (!gl.getProgramParameter(_program, gl.LINK_STATUS)) {
    alert(
      'Nie można dokonać linkowania shaderów: \n\n' +
        gl.getProgramInfoLog(_program)
    );
    return null;
  }

  return _program;
}

function loadShader(gl, type, source) {
  const _shader = gl.createShader(type);

  // Pozyskaj kod źródłowy shadera
  gl.shaderSource(_shader, source);

  // Skompiluj shader
  gl.compileShader(_shader);

  // Wyświetl komunikacje o błędzie jeśli kompilacja shaderów zawiodła
  if (!gl.getShaderParameter(_shader, gl.COMPILE_STATUS)) {
    alert(
      'Wystąpił błąd podczas kompilowania shadera: \n\n' +
        gl.getShaderInfoLog(_shader)
    );
    gl.deleteShader(_shader);
    return null;
  }

  return _shader;
}
