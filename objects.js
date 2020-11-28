var g_Renderer = null;
var g_Statek = null;
var g_Rock = null;
var g_RockTexture = null;

const astSceneInitiator = async () => {

  g_Rock = await astLoadModel('res/models/rock1.obj');
  g_RockTexture = astLoadTexture('res/images/moon.jpg');
  g_Statek = astInstanceCreate(Statek, 0, 0, 0);
  g_Renderer = astInstanceCreate(Renderer, 0, 0, 0);
  astInstanceCreate(Skybox, 0, 0, 0);

  const rock_range = 1000;
  for (var i = 0; i < 20; i++) {
    astInstanceCreate(Rock,
      rock_range * Math.random() - rock_range / 2,
      rock_range * Math.random() - rock_range / 2,
      rock_range * Math.random() - rock_range / 2
    );
  }

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
    this.distance = 40;
    this.above = 10;
    this.warp = 500;
  }

  Render() {

    this.distance = 30 + 3 * g_Statek.speed * g_Statek.speed;

    mat4.identity(m_Projection);
    mat4.identity(m_View);

    mat4.perspective(m_Projection, (90 * Math.PI) / 180, 1.77, 1, 50000000);

    mat4.translate(m_View, m_View, [0, -this.above, -this.distance]);
    let v_lookat = mat4.create();
    mat4.lookAt(v_lookat,
      [g_Statek.x, g_Statek.y, g_Statek.z],
      [
        g_Statek.x + g_Statek.nor_pitch[0],
        g_Statek.y + g_Statek.nor_pitch[1],
        g_Statek.z + g_Statek.nor_pitch[2]
      ],
      g_Statek.nor_yaw
    );
    mat4.multiply(m_View, m_View, v_lookat);

    astMatricesUpdate();

  }

}

// KLASA SKYBOXA
class Skybox extends _Object {
  Create() {
    this.layer = 999;
    
    this.t = astLoadTexture('res/images/top.png');
    this.b = astLoadTexture('res/images/bottom.png');
    this.l = astLoadTexture('res/images/left.png');
    this.r = astLoadTexture('res/images/right.png');
    this.f = astLoadTexture('res/images/front.png');
    this.k = astLoadTexture('res/images/back.png');
  }

  Render() {
    const size = 8000000;

    const sky_color = [1, 1, 1, 1];

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

    const lines_color = [0.5, 0, 0.5, 0.5];
    //Linie boczne
    astDrawLine(
      -g_Renderer.warp,
      -g_Renderer.warp,
      -2 * g_Renderer.warp,

      -g_Renderer.warp,
      -g_Renderer.warp,
      +2 * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      -g_Renderer.warp,
      -2 * g_Renderer.warp,

      +g_Renderer.warp,
      -g_Renderer.warp,
      +2 * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -g_Renderer.warp,
      +g_Renderer.warp,
      -2 * g_Renderer.warp,

      -g_Renderer.warp,
      +g_Renderer.warp,
      +2 * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      +g_Renderer.warp,
      -2 * g_Renderer.warp,

      +g_Renderer.warp,
      +g_Renderer.warp,
      +2 * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );

    //Linie na dole
    astDrawLine(
      -2 * g_Renderer.warp,
      -g_Renderer.warp,
      -g_Renderer.warp,

      +2 * g_Renderer.warp,
      -g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -2 * g_Renderer.warp,
      +g_Renderer.warp,
      -g_Renderer.warp,

      +2 * g_Renderer.warp,
      +g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -g_Renderer.warp,
      -2 * g_Renderer.warp,
      -g_Renderer.warp,

      -g_Renderer.warp,
      +2 * g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      -2 * g_Renderer.warp,
      -g_Renderer.warp,

      +g_Renderer.warp,
      +2 * g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );

    //Linie na gorze
    astDrawLine(
      -2 * g_Renderer.warp,
      -g_Renderer.warp,
      +g_Renderer.warp,

      +2 * g_Renderer.warp,
      -g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -2 * g_Renderer.warp,
      +g_Renderer.warp,
      +g_Renderer.warp,

      +2 * g_Renderer.warp,
      +g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -g_Renderer.warp,
      -2 * g_Renderer.warp,
      +g_Renderer.warp,

      -g_Renderer.warp,
      +2 * g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      -2 * g_Renderer.warp,
      +g_Renderer.warp,

      +g_Renderer.warp,
      +2 * g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );

  }
}

// KLASA STATKU
class Statek extends _Object {

  async Create() {
    
    this.layer = 10;

    this.radius = 4;

    this.speed = 0;
    this.speed_max = 2;
    this.speed_delta = 0.03125;

    this.nor_pitch = [1, 0, 0];
    this.nor_roll = [0, 1, 0];
    this.nor_yaw = [0, 0, 1];

    this.rot_delta = 0.125;
    this.rot_max = 2;

    this.rot_pitch = 0;
    this.rot_roll = 0;
    this.rot_yaw = 0;

    this.direction = [1, 0, 0];

    this.model = await astLoadModel('res/models/shipv2transformed000.obj');
    this.texShip = astLoadTexture('res/images/ship_tex.png');
  }

  Render() {

    /*
    astDrawLine(
      0, 0, 0,
      20 * this.direction[0],
      20 * this.direction[1],
      20 * this.direction[2],
      1, 0, 0, 1
    );

    astDrawLine(
      0, 0, 0,
      20 * this.nor_roll[0],
      20 * this.nor_roll[1],
      20 * this.nor_roll[2],
      0, 1, 0, 1
    );

    astDrawLine(
      0, 0, 0,
      20 * this.nor_yaw[0],
      20 * this.nor_yaw[1],
      20 * this.nor_yaw[2],
      0, 0, 1, 1
    );
    */

    mat4.identity(m_World);
    mat4.translate(m_World, m_World, [this.x, this.y, this.z]);

    let m_temp = mat4.create();
    m_temp[ 0] = this.nor_roll[0];
    m_temp[ 1] = this.nor_roll[1];
    m_temp[ 2] = this.nor_roll[2];

    m_temp[ 4] = this.nor_yaw[0];
    m_temp[ 5] = this.nor_yaw[1];
    m_temp[ 6] = this.nor_yaw[2];

    m_temp[ 8] = this.direction[0];
    m_temp[ 9] = this.direction[1];
    m_temp[10] = this.direction[2];

    mat4.multiply(m_World, m_World, m_temp);
    mat4.rotateZ(m_World, m_World, -this.rot_pitch / 10);
    mat4.rotateY(m_World, m_World, this.rot_yaw / 10);
    mat4.rotateX(m_World, m_World, this.rot_roll / 10);
    astMatricesUpdate();

    gl.bindTexture(gl.TEXTURE_2D, this.texShip);
    astDrawModel(this.model);

    mat4.identity(m_World);
    astMatricesUpdate();

    gl.bindTexture(gl.TEXTURE_2D, tex0);
  }

  Update() {

    const f_rotYaw = (angle) => {

      let q = [
        Math.sin(angle / 2) * this.nor_yaw[0],
        Math.sin(angle / 2) * this.nor_yaw[1],
        Math.sin(angle / 2) * this.nor_yaw[2],
        Math.cos(angle / 2)
      ];

      vec3.transformQuat(this.direction, this.direction, q);
      vec3.transformQuat(this.nor_pitch, this.nor_pitch, q);
      vec3.transformQuat(this.nor_roll, this.nor_roll, q);

      vec3.normalize(this.direction, this.direction);
      vec3.normalize(this.nor_pitch, this.nor_pitch);
      vec3.normalize(this.nor_roll, this.nor_roll);
    }

    const f_rotPitch = (angle) => {

      let q = [
        Math.sin(angle / 2) * this.nor_pitch[0],
        Math.sin(angle / 2) * this.nor_pitch[1],
        Math.sin(angle / 2) * this.nor_pitch[2],
        Math.cos(angle / 2)
      ];

      vec3.transformQuat(this.direction, this.direction, q);
      vec3.transformQuat(this.nor_yaw, this.nor_yaw, q);
      vec3.transformQuat(this.nor_roll, this.nor_roll, q);

      vec3.normalize(this.direction, this.direction);
      vec3.normalize(this.nor_yaw, this.nor_yaw);
      vec3.normalize(this.nor_roll, this.nor_roll);
    }

    const f_rotRoll = (angle) => {

      let q = [
        Math.sin(angle / 2) * this.nor_roll[0],
        Math.sin(angle / 2) * this.nor_roll[1],
        Math.sin(angle / 2) * this.nor_roll[2],
        Math.cos(angle / 2)
      ];

      vec3.transformQuat(this.direction, this.direction, q);
      vec3.transformQuat(this.nor_yaw, this.nor_yaw, q);
      vec3.transformQuat(this.nor_pitch, this.nor_pitch, q);

      vec3.normalize(this.direction, this.direction);
      vec3.normalize(this.nor_yaw, this.nor_yaw);
      vec3.normalize(this.nor_pitch, this.nor_pitch);
    }

    if (this.rot_pitch > 0) this.rot_pitch -= this.rot_delta / 2;
    if (this.rot_pitch < 0) this.rot_pitch += this.rot_delta / 2;

    if (this.rot_roll > 0) this.rot_roll -= this.rot_delta / 2;
    if (this.rot_roll < 0) this.rot_roll += this.rot_delta / 2;

    if (this.rot_yaw > 0) this.rot_yaw -= this.rot_delta / 2;
    if (this.rot_yaw < 0) this.rot_yaw += this.rot_delta / 2;

    if (keyStatus['q']) {
      if (this.rot_pitch <  this.rot_max) this.rot_pitch += this.rot_delta;
    }
    if (keyStatus['e']) {
      if (this.rot_pitch > -this.rot_max) this.rot_pitch -= this.rot_delta;
    }

    if (keyStatus['ArrowUp']) {
      if (this.rot_roll <  this.rot_max) this.rot_roll += this.rot_delta;
    }
    if (keyStatus['ArrowDown']) {
      if (this.rot_roll > -this.rot_max) this.rot_roll -= this.rot_delta;
    }

    if (keyStatus['ArrowLeft']) {
      if (this.rot_yaw <  this.rot_max) this.rot_yaw += this.rot_delta;
    }
    if (keyStatus['ArrowRight']) {
      if (this.rot_yaw > -this.rot_max) this.rot_yaw -= this.rot_delta;
    }

    f_rotPitch(-this.rot_pitch * Math.PI / 180);
    f_rotRoll(this.rot_roll * Math.PI / 180);
    f_rotYaw(this.rot_yaw * Math.PI / 180);

    if (keyStatus['w']) {
      if (this.speed < this.speed_max) this.speed += this.speed_delta;
    }
    else {
      if (this.speed > 0) this.speed -= this.speed_delta;
    }

    this.x += this.speed * this.direction[0];
    this.y += this.speed * this.direction[1];
    this.z += this.speed * this.direction[2];

    if (this.x >  g_Renderer.warp) this.x -= 2 * g_Renderer.warp;
    if (this.x < -g_Renderer.warp) this.x += 2 * g_Renderer.warp;
    if (this.y >  g_Renderer.warp) this.y -= 2 * g_Renderer.warp;
    if (this.y < -g_Renderer.warp) this.y += 2 * g_Renderer.warp;
    if (this.z >  g_Renderer.warp) this.z -= 2 * g_Renderer.warp;
    if (this.z < -g_Renderer.warp) this.z += 2 * g_Renderer.warp;
  }

}

//KLASA ASTEROIDKI
class Rock extends _Object {

  Create() {

    const sizes = [1, 2, 4, 8];
    this.scale = 2 * sizes[Math.floor(4 * Math.random())];

    this.radius = 2.5 * this.scale;

    this.rot = 0;
    this.rot_speed = 2 * Math.random() * Math.PI / 180;
    this.rot_axis = [
      2 * Math.random() - 1,
      2 * Math.random() - 1,
      2 * Math.random() - 1
    ];
    vec3.normalize(this.rot_axis, this.rot_axis);
    this.mov_axis = [
      0.5 * Math.random() - 0.25,
      0.5 * Math.random() - 0.25,
      0.5 * Math.random() - 0.25
    ];
  }

  Update() {

    if (vec3.dist([this.x, this.y, this.z], [g_Statek.x, g_Statek.y, g_Statek.z]) < this.radius + g_Statek.radius) {
      astInstanceDestroy(this);
    }

    this.rot += this.rot_speed;
    this.x += this.mov_axis[0];
    this.y += this.mov_axis[1];
    this.z += this.mov_axis[2];

    if (this.x >  g_Renderer.warp) this.x -= 2 * g_Renderer.warp;
    if (this.x < -g_Renderer.warp) this.x += 2 * g_Renderer.warp;
    if (this.y >  g_Renderer.warp) this.y -= 2 * g_Renderer.warp;
    if (this.y < -g_Renderer.warp) this.y += 2 * g_Renderer.warp;
    if (this.z >  g_Renderer.warp) this.z -= 2 * g_Renderer.warp;
    if (this.z < -g_Renderer.warp) this.z += 2 * g_Renderer.warp;
  }

  Render() {

    const r_matrix = mat4.create();
    mat4.fromQuat(r_matrix, [
      Math.sin(this.rot / 2) * this.rot_axis[0],
      Math.sin(this.rot / 2) * this.rot_axis[1],
      Math.sin(this.rot / 2) * this.rot_axis[2],
      Math.cos(this.rot / 2)
    ]);

    const vec_warp = [
      [0, 0, 0],
      [-g_Renderer.warp, 0, 0],
      [ g_Renderer.warp, 0, 0],
      [0, -g_Renderer.warp, 0],
      [0,  g_Renderer.warp, 0],
      [0, 0, -g_Renderer.warp],
      [0, 0,  g_Renderer.warp],
    ];
    for (var i = 0 ; i < 7; i++) {
      mat4.translate(m_World, m_World, [this.x + 2 * vec_warp[i][0], this.y + 2 * vec_warp[i][1], this.z + 2 * vec_warp[i][2]]);
      mat4.scale(m_World, m_World, [this.scale, this.scale, this.scale]);
      mat4.multiply(m_World, m_World, r_matrix);
      astMatricesUpdate();

      gl.bindTexture(gl.TEXTURE_2D, g_RockTexture);
      astDrawModel(g_Rock);
      gl.bindTexture(gl.TEXTURE_2D, tex0);

      mat4.identity(m_World);
    } 
    astMatricesUpdate();
  }

}