var g_Statek = null;

const astSceneInitiator = () => {
  astInstanceCreate(Renderer, 0, 0, 0);
  astInstanceCreate(Skybox, 0, 0, 0);
  g_Statek = astInstanceCreate(Statek, 0, 0, 0);
};

/////////////////////////////////////////////////////////////

/*

class Nazwa extends _Object {
	
	Create() {...}
	Render() {...}
	Update() {...}
	
}

*/

// KLASA RENDERERA
class Renderer extends _Object {
  Create() {
    this.layer = -100;
    this.angle = 0;
  }

  Render() {
    mat4.identity(m_Projection);
    mat4.identity(m_View);

    mat4.perspective(m_Projection, (60 * Math.PI) / 180, 1.77, 1, 1000000);
    mat4.lookAt(
      m_View,
      [80 * Math.cos(this.angle), 80 * Math.sin(this.angle), 40],
      [0, 0, 0],
      [0, 0, 1]
    );
    //mat4.

    astMatricesUpdate();
  }

  Update() {
    if (keyStatus['q']) this.angle -= 0.02;
    if (keyStatus['e']) this.angle += 0.02;
  }
}

// KLASA SKYBOXA
class Skybox extends _Object {
  Create() {
    this.layer = -99;

    this.t = astLoadTexture('http://127.0.0.1/res/images/top.png');
    this.b = astLoadTexture('http://127.0.0.1/res/images/bottom.png');
    this.l = astLoadTexture('http://127.0.0.1/res/images/left.png');
    this.r = astLoadTexture('http://127.0.0.1/res/images/right.png');
    this.f = astLoadTexture('http://127.0.0.1/res/images/front.png');
    this.k = astLoadTexture('http://127.0.0.1/res/images/back.png');
  }

  Render() {
    const size = 100000;

    const sky_color = [0.25, 0.5, 0.75, 1];

    // top
    gl.bindTexture(gl.TEXTURE_2D, this.t);
    astDrawTriangle(
      -size,
      -size,
      +size,
      +size,
      -size,
      +size,
      -size,
      +size,
      +size,
      0,
      0,
      1,
      0,
      0,
      1,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );
    astDrawTriangle(
      +size,
      +size,
      +size,
      -size,
      +size,
      +size,
      +size,
      -size,
      +size,
      1,
      1,
      0,
      1,
      1,
      0,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );

    // bottom
    gl.bindTexture(gl.TEXTURE_2D, this.b);
    astDrawTriangle(
      -size,
      +size,
      -size,
      +size,
      +size,
      -size,
      -size,
      -size,
      -size,
      0,
      0,
      1,
      0,
      0,
      1,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );
    astDrawTriangle(
      +size,
      -size,
      -size,
      -size,
      -size,
      -size,
      +size,
      +size,
      -size,
      1,
      1,
      0,
      1,
      1,
      0,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );

    // front
    gl.bindTexture(gl.TEXTURE_2D, this.f);
    astDrawTriangle(
      -size,
      +size,
      +size,
      +size,
      +size,
      +size,
      -size,
      +size,
      -size,
      0,
      0,
      1,
      0,
      0,
      1,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );
    astDrawTriangle(
      +size,
      +size,
      -size,
      -size,
      +size,
      -size,
      +size,
      +size,
      +size,
      1,
      1,
      0,
      1,
      1,
      0,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );

    // back
    gl.bindTexture(gl.TEXTURE_2D, this.k);
    astDrawTriangle(
      +size,
      -size,
      +size,
      -size,
      -size,
      +size,
      +size,
      -size,
      -size,
      0,
      0,
      1,
      0,
      0,
      1,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );
    astDrawTriangle(
      -size,
      -size,
      -size,
      +size,
      -size,
      -size,
      -size,
      -size,
      +size,
      1,
      1,
      0,
      1,
      1,
      0,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );

    // left
    gl.bindTexture(gl.TEXTURE_2D, this.l);
    astDrawTriangle(
      -size,
      -size,
      +size,
      -size,
      +size,
      +size,
      -size,
      -size,
      -size,
      0,
      0,
      1,
      0,
      0,
      1,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );
    astDrawTriangle(
      -size,
      +size,
      -size,
      -size,
      -size,
      -size,
      -size,
      +size,
      +size,
      1,
      1,
      0,
      1,
      1,
      0,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );

    //right
    gl.bindTexture(gl.TEXTURE_2D, this.r);
    astDrawTriangle(
      +size,
      +size,
      +size,
      +size,
      -size,
      +size,
      +size,
      +size,
      -size,
      0,
      0,
      1,
      0,
      0,
      1,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );
    astDrawTriangle(
      +size,
      -size,
      -size,
      +size,
      +size,
      -size,
      +size,
      -size,
      +size,
      1,
      1,
      0,
      1,
      1,
      0,
      sky_color[0],
      sky_color[1],
      sky_color[2],
      sky_color[3]
    );

    gl.bindTexture(gl.TEXTURE_2D, tex0);
  }
}

// KLASA STATKU
class Statek extends _Object {
  async Create() {
    this.speed = 0.2;

    this.nor_pitch = [1, 0, 0];
    this.nor_roll = [0, 1, 0];
    this.nor_yaw = [0, 0, 1];

    this.direction = [1, 0, 0];
    this.model = await astLoadModel('http://127.0.0.1/res/models/shipv2.obj');
    this.texShip = astLoadTexture('http://127.0.0.1/res/images/uv.jpg');
  }

  Render() {
    mat4.translate(m_World, m_World, [this.x, this.y, this.z]);
    // mat4.rotateX(m_World, m_World, 90 * Math.PI / 180);
    astMatricesUpdate();

    gl.bindTexture(gl.TEXTURE_2D, this.texShip);
    astDrawModel(this.model);

    mat4.identity(m_World);
    astMatricesUpdate();

    gl.bindTexture(gl.TEXTURE_2D, tex0);
    astDrawTriangle(
      -20,
      -20,
      0,
      20,
      -20,
      0,
      -20,
      20,
      0,

      0,
      0,
      0,
      0,
      0,
      0,

      0,
      0,
      0.33,
      1
    );

    astDrawTriangle(
      20,
      20,
      0,
      -20,
      20,
      0,
      20,
      -20,
      0,

      0,
      0,
      0,
      0,
      0,
      0,

      0.33,
      0,
      0.33,
      1
    );

    astDrawLine(
      -20,
      -20,
      0,
      -20,
      -20,
      20,

      1,
      1,
      1,
      1
    );

    astDrawLine(
      20,
      -20,
      0,
      20,
      -20,
      20,

      1,
      1,
      1,
      1
    );

    astDrawLine(
      -20,
      20,
      0,
      -20,
      20,
      20,

      1,
      1,
      1,
      1
    );

    astDrawLine(
      20,
      20,
      0,
      20,
      20,
      20,

      1,
      1,
      1,
      1
    );
  }

  Update() {
    if (keyStatus['ArrowLeft']) {
      let theta = 0.1;
      const q = [
        Math.cos(theta / 2),
        Math.sin(theta / 2) * this.nor_yaw[0],
        Math.sin(theta / 2) * this.nor_yaw[1],
        Math.sin(theta / 2) * this.nor_yaw[2],
      ];

      vec3.transformQuat(this.direction, this.direction, q);
      console.log(this.direction);
      vec3.normalize(this.direction, this.direction);
    }

    if (keyStatus[' ']) {
      this.x += this.speed * this.direction[0];
      this.y += this.speed * this.direction[1];
      this.z += this.speed * this.direction[2];
    }
  }
}
