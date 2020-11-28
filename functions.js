// Tworzenie instancji na scenie
const astInstanceCreate = (_class, x, y, z) => {
  //let _instance = ;
  astObjectList.push({ obj: new _class(x, y, z), removed: false });
  return astObjectList[astObjectList.length - 1].obj;
};

// Usuwanie instancji ze sceny
const astInstanceDestroy = (reference) => {
  astObjectList.some( (e, i) => {
    if (e.obj == reference) {
      e.removed = true;
      return true;
    }
  });
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
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, astCBuffer);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, astTBuffer);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

// Narysuj linie
const astDrawLine = (x1, y1, z1, x2, y2, z2, r, g, b, a) => {
  const positions = [x1, y1, z1, x2, y2, z2];

  const colors = [r, g, b, a, r, g, b, a];

  const texcoords = [0, 0, 1, 1];

  gl.bindBuffer(gl.ARRAY_BUFFER, astVBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, astCBuffer);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, astTBuffer);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
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
  //Inicjalizacja listy zawirającej dane o wierzchołkach
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];
  const objColors = [[0, 0, 0]];

  const objVertexData = [objPositions, objTexcoords, objNormals, objColors];

  let webglVertexData = [
    [], //Pozycje wierzchołków (X Y Z)
    [], //Teksturowanie wierzchołków (S T)
    [], //Normalne wierzchołków (X Y Z)
    [], //Kolory wierzchołków (R G B A)
  ];

  const materialLibs = [];
  const geometries = [];
  let geometry;
  let groups = ['default'];
  let material = 'default';
  let object = 'default';

  const noop = () => {};

  function newGeometry() {
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

      if (i === 0 && objColors.length > 1) {
        geometry.data.color.push(...objColors[index]);
      }
    });
  }

  const keywords = {
    //Parsowanie pozycji i kolorów wierzchołków
    v(parts) {
      if (parts.length > 3) {
        objPositions.push(parts.slice(0, 3).map(parseFloat));
        objColors.push(parts.slice(3).map(parseFloat));
      } else {
        objPositions.push(parts.map(parseFloat));
      }
    },
    //Parsowanie normalnych wierzchołków
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    //Parsowanie mapowania tekstur wierzchołków
    vt(parts) {
      objTexcoords.push(parts.map(parseFloat));
    },
    //Składanie ścian z wierzchołków
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop,

    mtllib(parts, unparsedArgs) {
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
      console.warn('Nieznany symbol:', keyword);
      continue;
    }
    handler(parts, unparsedArgs);
  }

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
    bPosition: null,
    //bNormal: null,
    bTexture: null,
    bColor: null,
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

  modelobj.bPosition = gl.createBuffer();
  //modelobj.bNormal = gl.createBuffer();
  modelobj.bTexture = gl.createBuffer();
  modelobj.bColor = gl.createBuffer();

  //Pozycja wierzcholka (X Y Z)
  gl.bindBuffer(gl.ARRAY_BUFFER, modelobj.bPosition);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelobj.vertices),
    gl.STATIC_DRAW
  );
  //Kolor wierzcholka (R G B A)
  gl.bindBuffer(gl.ARRAY_BUFFER, modelobj.bColor);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelobj.colors),
    gl.STATIC_DRAW
  );

  //Mapowanie tekstury (S T)
  gl.bindBuffer(gl.ARRAY_BUFFER, modelobj.bTexture);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelobj.texcoords),
    gl.STATIC_DRAW
  );

  return modelobj;
}

const astDrawModel = (model) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bPosition);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.bColor);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.bTexture);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);

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
