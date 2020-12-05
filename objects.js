var g_Renderer = null;
var g_Statek = null;
var g_Rock = null;
var g_HUD = null;
var g_RockTexture = null;
var g_RocketModel = null;
var g_RocketTexture = null;
var g_ParticleModel = null;
var g_ParticleTexture = null;

var g_Music = null;
var g_SndWeapon = null;
var g_SndDamage = null;
var g_SndOverheat = null;
var g_SndCooldown = null;

var g_Score = 0;

const astSceneInitiator = async () => {

  g_Music = new Audio('res/sounds/ost_level.mp3');
  g_Music.loop = true;

  g_SndWeapon = new Audio('res/sounds/pew.mp3');
  g_SndDamage = new Audio('res/sounds/damage.mp3');
  g_SndOverheat = new Audio('res/sounds/overheat.mp3');
  g_SndCooldown = new Audio('res/sounds/cooldown.mp3');

  g_Rock = await astLoadModel('res/models/rock1.obj');
  g_RockTexture = astLoadTexture('res/images/moon.jpg');
  g_RocketModel = await astLoadModel('res/models/rocket.obj');
  g_RocketTexture = astLoadTexture('res/images/rocket.png');
  g_ParticleModel = await astLoadModel('res/models/fire_particle.obj');
  g_ParticleTexture = astLoadTexture('res/images/fire_particle.png');
  g_Statek = astInstanceCreate(Statek, 0, 0, 0);
  g_Renderer = astInstanceCreate(Renderer, 0, 0, 0);
  g_HUD = astInstanceCreate(HUD, 0, 0, 0);
  astInstanceCreate(Skybox, 0, 0, 0);

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
    this.warp = 512;

    this.vec_warp = [
      //Środek
      [0, 0, 0],

      //Boki
      [-this.warp, 0, 0],
      [ this.warp, 0, 0],
      [0, -this.warp, 0],
      [0,  this.warp, 0],
      [0, 0, -this.warp],
      [0, 0,  this.warp],

      //Rogi-boki
      [-this.warp, -this.warp, 0],
      [ this.warp, -this.warp, 0],
      [-this.warp,  this.warp, 0],
      [ this.warp,  this.warp, 0],

      [-this.warp, 0, -this.warp],
      [ this.warp, 0, -this.warp],
      [-this.warp, 0,  this.warp],
      [ this.warp, 0,  this.warp],

      [0, -this.warp, -this.warp],
      [0,  this.warp, -this.warp],
      [0, -this.warp,  this.warp],
      [0,  this.warp,  this.warp],

      //Rogi-rogi
      [-this.warp, -this.warp, -this.warp],
      [ this.warp, -this.warp, -this.warp],
      [-this.warp,  this.warp, -this.warp],
      [ this.warp,  this.warp, -this.warp],

      [-this.warp, -this.warp,  this.warp],
      [ this.warp, -this.warp,  this.warp],
      [-this.warp,  this.warp,  this.warp],
      [ this.warp,  this.warp,  this.warp],
    ];
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

    this.line_ex = 1;

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
      -this.line_ex * g_Renderer.warp,

      -g_Renderer.warp,
      -g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      -g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,

      +g_Renderer.warp,
      -g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -g_Renderer.warp,
      +g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,

      -g_Renderer.warp,
      +g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      +g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,

      +g_Renderer.warp,
      +g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );

    //Linie na dole
    astDrawLine(
      -this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,
      -g_Renderer.warp,

      +this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,
      -g_Renderer.warp,

      +this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,

      -g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,

      +g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );

    //Linie na gorze
    astDrawLine(
      -this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,
      +g_Renderer.warp,

      +this.line_ex * g_Renderer.warp,
      -g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,
      +g_Renderer.warp,

      +this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      -g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,

      -g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,

      lines_color[0], lines_color[1], lines_color[2], lines_color[3]
    );
    astDrawLine(
      +g_Renderer.warp,
      -this.line_ex * g_Renderer.warp,
      +g_Renderer.warp,

      +g_Renderer.warp,
      +this.line_ex * g_Renderer.warp,
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

    this.spacebar = 0;

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

    this.hp = 3;
    this.shield = 0;
    this.max_shield = 300;
    this.cooldown = 0;
    this.overheat = false;
    this.max_cooldown = 500;
    this.cooldown_increase = 80;

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
    //mat4.translate(m_World, m_World, [this.x, this.y, this.z]);

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

    if (this.shield % 2 == 0 && this.hp > 0) {
      for (var i = 0 ; i < g_Renderer.vec_warp.length; i++) {
        mat4.translate(m_World, m_World, [this.x + 2 * g_Renderer.vec_warp[i][0], this.y + 2 * g_Renderer.vec_warp[i][1], this.z + 2 * g_Renderer.vec_warp[i][2]]);
        mat4.multiply(m_World, m_World, m_temp);
        mat4.rotateZ(m_World, m_World, -this.rot_pitch / 10);
        mat4.rotateY(m_World, m_World, this.rot_yaw / 10);
        mat4.rotateX(m_World, m_World, this.rot_roll / 10);
        astMatricesUpdate();
    
        gl.bindTexture(gl.TEXTURE_2D, this.texShip);
        astDrawModel(this.model);
        gl.bindTexture(gl.TEXTURE_2D, tex0);

        mat4.identity(m_World);
        astMatricesUpdate();
      } 
    }

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

    if (keyStatus['q'] && g_HUD.game) {
      if (this.rot_pitch <  this.rot_max) this.rot_pitch += this.rot_delta;
    }
    if (keyStatus['e'] && g_HUD.game) {
      if (this.rot_pitch > -this.rot_max) this.rot_pitch -= this.rot_delta;
    }

    if (keyStatus['ArrowUp'] && g_HUD.game) {
      if (this.rot_roll <  this.rot_max) this.rot_roll += this.rot_delta;
    }
    if (keyStatus['ArrowDown'] && g_HUD.game) {
      if (this.rot_roll > -this.rot_max) this.rot_roll -= this.rot_delta;
    }

    if (keyStatus['ArrowLeft'] && g_HUD.game) {
      if (this.rot_yaw <  this.rot_max) this.rot_yaw += this.rot_delta;
    }
    if (keyStatus['ArrowRight'] && g_HUD.game) {
      if (this.rot_yaw > -this.rot_max) this.rot_yaw -= this.rot_delta;
    }

    f_rotPitch(-this.rot_pitch * Math.PI / 180);
    f_rotRoll(this.rot_roll * Math.PI / 180);
    f_rotYaw(this.rot_yaw * Math.PI / 180);

    if (keyStatus['w'] && g_HUD.game) {
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


    if (this.spacebar == 1) this.spacebar = 2;
    if (keyStatus['s'] && g_HUD.game && this.spacebar == 0) this.spacebar = 1;
    if (!keyStatus['s'] && g_HUD.game && this.spacebar == 2) this.spacebar = 0;

    if (this.spacebar == 1 && this.overheat == false) {
      g_SndWeapon.currentTime = 0;
      g_SndWeapon.play();

      let rocket = astInstanceCreate(Rocket, this.x, this.y, this.z);
      
      rocket.direction = [...this.direction];
      rocket.roll = [...this.nor_roll];
      rocket.yaw = [...this.nor_yaw];

      rocket.orientation[ 0] = this.nor_roll[0];
      rocket.orientation[ 1] = this.nor_roll[1];
      rocket.orientation[ 2] = this.nor_roll[2];
  
      rocket.orientation[ 4] = this.nor_yaw[0];
      rocket.orientation[ 5] = this.nor_yaw[1];
      rocket.orientation[ 6] = this.nor_yaw[2];
  
      rocket.orientation[ 8] = this.direction[0];
      rocket.orientation[ 9] = this.direction[1];
      rocket.orientation[10] = this.direction[2];

      this.cooldown += this.cooldown_increase;
    }

    if (this.cooldown > this.max_cooldown) {
      g_SndOverheat.currentTime = 0;
      g_SndOverheat.play();
      this.cooldown = this.max_cooldown;
      this.overheat = true;
    }
    if (this.cooldown > 0) this.cooldown--;
    if (this.cooldown == 0 && this.overheat == true) {
      g_SndCooldown.currentTime = 0;
      g_SndCooldown.play();
      this.overheat = false;
    }

    if (this.shield > 0) this.shield--;

  }

}

//KLASA ASTEROIDKI
class Rock extends _Object {

  Startme(sizeindex = null, movaxis = null) {

    this.size_index = 0;
    if (sizeindex == null) {
      this.size_index = Math.floor(4 * Math.random());
    }
    else {
      this.size_index = sizeindex;
    }

    const sizes = [1, 2, 4, 8];
    this.scale = 2 * sizes[this.size_index];
    this.hp = sizes[this.size_index];

    this.radius = 2.5 * this.scale;


    this.rot = 0;
    this.rot_speed = 2 * Math.random() * Math.PI / 180;

    this.rot_axis = [
      2 * Math.random() - 1,
      2 * Math.random() - 1,
      2 * Math.random() - 1
    ];
    vec3.normalize(this.rot_axis, this.rot_axis);

    if (movaxis == null) {
      this.mov_axis = [
        0.5 * Math.random() - 0.25,
        0.5 * Math.random() - 0.25,
        0.5 * Math.random() - 0.25
      ];
    }
    else {
      this.mov_axis = movaxis;
    }
  }

  Update() {

    if (g_Statek.shield == 0 && vec3.dist([this.x, this.y, this.z], [g_Statek.x, g_Statek.y, g_Statek.z]) < this.radius + g_Statek.radius) {
      for (var i = 0; i < 50; i++) {
        const _particle = astInstanceCreate(Particle, this.x, this.y, this.z);
        _particle.speed = 2;
      }
      astInstanceDestroy(this);
      g_Score -= 100;
      g_Statek.hp--;
      g_Statek.shield = g_Statek.max_shield;

      g_SndDamage.currentTime = 0;
      g_SndDamage.play();
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

    if (this.hp <= 0) {
      if (this.size_index > 0) {
        const child_1 = astInstanceCreate(Rock, this.x, this.y, this.z);
        const child_2 = astInstanceCreate(Rock, this.x, this.y, this.z);

        child_1.Startme(
          this.size_index - 1,
          [
            this.child_roll[0],
            this.child_roll[1],
            this.child_roll[2]
          ]
        );
        child_2.Startme(
          this.size_index - 1,
          [
            -this.child_roll[0],
            -this.child_roll[1],
            -this.child_roll[2]
          ]
        );
      }
      astInstanceDestroy(this);}
  }

  Render() {

    const r_matrix = mat4.create();
    mat4.fromQuat(r_matrix, [
      Math.sin(this.rot / 2) * this.rot_axis[0],
      Math.sin(this.rot / 2) * this.rot_axis[1],
      Math.sin(this.rot / 2) * this.rot_axis[2],
      Math.cos(this.rot / 2)
    ]);

    gl.uniform1i(
      programInfo.uniformLocations.lights,
      true
    );
    for (var i = 0 ; i < g_Renderer.vec_warp.length; i++) {
      mat4.translate(m_World, m_World, [this.x + 2 * g_Renderer.vec_warp[i][0], this.y + 2 * g_Renderer.vec_warp[i][1], this.z + 2 * g_Renderer.vec_warp[i][2]]);
      mat4.scale(m_World, m_World, [this.scale, this.scale, this.scale]);
      mat4.multiply(m_World, m_World, r_matrix);
      astMatricesUpdate();

      gl.bindTexture(gl.TEXTURE_2D, g_RockTexture);
      astDrawModel(g_Rock);
      gl.bindTexture(gl.TEXTURE_2D, tex0);

      mat4.identity(m_World);
    }
    gl.uniform1i(
      programInfo.uniformLocations.lights,
      false
    );
    astMatricesUpdate();
  }

}

//KLASA RAKIETKI
class Rocket extends _Object {

  Create() {
    this.speed = 8;
    this.lifespan = 120;
    this.radius = 0.5;
    this.direction = [1, 0, 0];
    this.roll = [0, 1, 0];
    this.yaw = [0, 0, 1];
    this.orientation = mat4.create();
  }

  Update() {
    this.x += this.speed * this.direction[0];
    this.y += this.speed * this.direction[1];
    this.z += this.speed * this.direction[2];

    if (this.x >  g_Renderer.warp) this.x -= 2 * g_Renderer.warp;
    if (this.x < -g_Renderer.warp) this.x += 2 * g_Renderer.warp;
    if (this.y >  g_Renderer.warp) this.y -= 2 * g_Renderer.warp;
    if (this.y < -g_Renderer.warp) this.y += 2 * g_Renderer.warp;
    if (this.z >  g_Renderer.warp) this.z -= 2 * g_Renderer.warp;
    if (this.z < -g_Renderer.warp) this.z += 2 * g_Renderer.warp;
    
    astObjectList.some( (e, i) => {

      if (e.obj.constructor.name == "Rock" && vec3.dist([this.x, this.y, this.z], [e.obj.x, e.obj.y, e.obj.z]) < this.radius + e.obj.radius) {
        astInstanceDestroy(this);
        e.obj.hp--;
        g_Score += 100;

        g_SndDamage.currentTime = 0;
        g_SndDamage.play();

        for (var i = 0; i < 50; i++) {
          const _particle = astInstanceCreate(Particle, this.x, this.y, this.z);
          _particle.speed = 2;
        }

        e.obj.mov_axis[0] += 2 * this.direction[0] / e.obj.scale;
        e.obj.mov_axis[1] += 2 * this.direction[1] / e.obj.scale;
        e.obj.mov_axis[2] += 2 * this.direction[2] / e.obj.scale;

        e.obj.child_roll = this.roll;

        return true;
      }
    });

    if (this.lifespan-- == 0) astInstanceDestroy(this);

    astInstanceCreate(Particle, this.x, this.y, this.z);
  }

  Render() {

    mat4.identity(m_World);

    for (var i = 0 ; i < g_Renderer.vec_warp.length; i++) {
      
      mat4.translate(m_World, m_World, [this.x + 2 * g_Renderer.vec_warp[i][0], this.y + 2 * g_Renderer.vec_warp[i][1], this.z + 2 * g_Renderer.vec_warp[i][2]]);
      mat4.multiply(m_World, m_World, this.orientation);
      mat4.scale(m_World, m_World, [4, 4, 4]);
      mat4.rotateX(m_World, m_World, 90 * Math.PI / 180);
      astMatricesUpdate();

      gl.bindTexture(gl.TEXTURE_2D, g_RocketTexture);
      astDrawModel(g_RocketModel);
      gl.bindTexture(gl.TEXTURE_2D, tex0);

      mat4.identity(m_World);
      astMatricesUpdate();
    } 
  }

}

//HUD
class HUD extends _Object {

  Create() {
    this.layer = 1000000;

    this.time = 0;

    this.label_begin1 = astLabelCreate('WEBSTEROIDS : THE GAME', 256, 380, 72);
    this.label_begin2 = astLabelCreate('Press ENTER to play', 600, 480, 36);

    ////////////////
    astLabelCreate('SCORE :', 8, 8, 24);
    this.labelScore = astLabelCreate(g_Score.toString(), 124, 8, 24);

    astLabelCreate('LIVES :', 8, 48, 24);

    astLabelCreate('OVERHEAT :', 8, 860, 24);

    this.hp_tex = astLoadTexture('res/images/hp.png');

    this.game = false;

  }

  Update() {
    astLabelContent(this.labelScore, g_Score.toString());

    var rock_count = 0;
    astObjectList.forEach( (e, i) => {
      if (e.obj.constructor.name == 'Rock') rock_count++;
    });

    if (rock_count == 0 && this.game) {
      this.label_begin1 = astLabelCreate('YOU WIN, CONGRATULATIONS', 182, 380, 72);
      this.label_begin2 = astLabelCreate('Press ENTER to play', 600, 480, 36);
      this.game = false;
      g_Music.pause();
      g_Music.currentTime = 0;
    }

    if (g_Statek.hp == 0 && this.game && rock_count > 0) {
      this.label_begin1 = astLabelCreate('YOU LOSE, TRY AGAIN', 362, 380, 72);
      this.label_begin2 = astLabelCreate('Press ENTER to play', 600, 480, 36);
      this.game = false;
      g_Music.pause();
      g_Music.currentTime = 0;

      astObjectList.forEach( (e, i) => {
        if (e.obj.constructor.name == 'Rock') astInstanceDestroy(e.obj);
      });
    }

    if (keyStatus['Enter'] && this.game == false) {
      astLabelDestroy(this.label_begin1);
      astLabelDestroy(this.label_begin2);
      this.game = true;

      g_Statek.direction = [1, 0, 0];
      g_Statek.nor_pitch = [1, 0, 0];
      g_Statek.nor_roll = [0, 1, 0];
      g_Statek.nor_yaw = [0, 0, 1];
      g_Statek.speed = 0;
      g_Statek.x = 0;
      g_Statek.y = 0;
      g_Statek.z = 0;
      g_Statek.cooldown = 0;
      g_Statek.overheat = false;
      g_Statek.hp = 3;
      g_Statek.shield = g_Statek.max_shield;
      g_Score = 0;

      g_Music.play();

      const rock_range = g_Renderer.warp * 2;
      for (var i = 0; i < 4; i++){
        const i_asteroid = astInstanceCreate(Rock,
          rock_range * Math.random() - rock_range / 2,
          rock_range * Math.random() - rock_range / 2,
          rock_range * Math.random() - rock_range / 2
        );
        i_asteroid.Startme(i);
      }

    }

    this.time++;
  }

  Render() {

    gl.clear(gl.DEPTH_BUFFER_BIT);

    const tri_x = 112;
    const tri_y = 50;

    const tri_w = 32;
    const tri_h = 32;
    const tri_m = 8;

    mat4.ortho(m_Projection, 0, 1600, 900, 0, -1000, 1000);
    mat4.identity(m_View);
    mat4.identity(m_World);
    astMatricesUpdate();

    gl.bindTexture(gl.TEXTURE_2D, this.hp_tex);
    for (var i = 0; i < g_Statek.hp; i++) {
      const vert_0 = [tri_x + i * (tri_w + tri_m), tri_y];
      const vert_1 = [tri_x + i * (tri_w + tri_m) + tri_w, tri_y];
      const vert_2 = [tri_x + i * (tri_w + tri_m) + tri_w, tri_y + tri_h];
      const vert_3 = [tri_x + i * (tri_w + tri_m), tri_y + tri_h];

      astDrawTriangle(
        vert_0[0], vert_0[1], 0,
        vert_1[0], vert_1[1], 0,
        vert_3[0], vert_3[1], 0,
        0, 0,
        1, 0,
        0, 1,
        1, 1, 1, 1
      );
      astDrawTriangle(
        vert_2[0], vert_2[1], 0,
        vert_3[0], vert_3[1], 0,
        vert_1[0], vert_1[1], 0,
        1, 1,
        0, 1,
        1, 0,
        1, 1, 1, 1
      );
    }
    gl.bindTexture(gl.TEXTURE_2D, tex0);

    const ov_x = 180;
    const ov_y = 866;
    const ov_w = 400;
    const ov_h = 24;
    const ov_m = 2;

    const ov_o = ov_w * (g_Statek.cooldown / g_Statek.max_cooldown)
    const vert_0 = [ov_x, ov_y];
    const vert_1 = [ov_x + ov_w, ov_y];
    const vert_2 = [ov_x + ov_w, ov_y + ov_h];
    const vert_3 = [ov_x, ov_y + ov_h];

    const vert_4 = [ov_x + ov_o, ov_y];
    const vert_5 = [ov_x + ov_o, ov_y + ov_h];

    var col_outline = 1; 
    var col_fill = [g_Statek.cooldown / g_Statek.max_cooldown, 1 - g_Statek.cooldown / g_Statek.max_cooldown, 0]; 

    if (g_Statek.overheat) {
      col_outline = 0;
      col_fill = [1, 0];
    }
    //Biała obramówka
    astDrawTriangle(
      vert_0[0] - ov_m, vert_0[1] - ov_m, 0,
      vert_1[0] + ov_m, vert_1[1] - ov_m, 0,
      vert_3[0] - ov_m, vert_3[1] + ov_m, 0,
      0, 0,
      0, 0,
      0, 0,
      1, col_outline, col_outline, 1
    );
    astDrawTriangle(
      vert_2[0] + ov_m, vert_2[1] + ov_m, 0,
      vert_3[0] - ov_m, vert_3[1] + ov_m, 0,
      vert_1[0] + ov_m, vert_1[1] - ov_m, 0,
      0, 0,
      0, 0,
      0, 0,
      1, col_outline, col_outline, 1
    );

    //Czarne pole
    astDrawTriangle(
      vert_0[0], vert_0[1], 0,
      vert_1[0], vert_1[1], 0,
      vert_3[0], vert_3[1], 0,
      0, 0,
      0, 0,
      0, 0,
      0, 0, 0, 1
    );
    astDrawTriangle(
      vert_2[0], vert_2[1], 0,
      vert_3[0], vert_3[1], 0,
      vert_1[0], vert_1[1], 0,
      0, 0,
      0, 0,
      0, 0,
      0, 0, 0, 1
    );

    //Rysowanie wskaźnika cooldowna
    astDrawTriangle(
      vert_0[0], vert_0[1], 0,
      vert_4[0], vert_4[1], 0,
      vert_3[0], vert_3[1], 0,
      0, 0,
      0, 0,
      0, 0,
      col_fill[0], col_fill[1], 0, 1
    );
    astDrawTriangle(
      vert_5[0], vert_5[1], 0,
      vert_3[0], vert_3[1], 0,
      vert_4[0], vert_4[1], 0,
      0, 0,
      0, 0,
      0, 0,
      col_fill[0], col_fill[1], 0, 1
    );
  }
}

class Particle extends _Object {

  Create() {
    this.speed = 0.125;
    this.vec = [
      2 * Math.random() - 1,
      2 * Math.random() - 1,
      2 * Math.random() - 1
    ];
    vec3.normalize(this.vec, this.vec);
    this.max_time = 30;
    this.time = this.max_time;
  }

  Update() {
    this.x += this.speed * this.vec[0];
    this.y += this.speed * this.vec[1];
    this.z += this.speed * this.vec[2];
    if (this.time-- <= 0) astInstanceDestroy(this);
  }

  Render() {
    for (var i = 0 ; i < g_Renderer.vec_warp.length; i++) {
      mat4.translate(m_World, m_World, [this.x + 2 * g_Renderer.vec_warp[i][0], this.y + 2 * g_Renderer.vec_warp[i][1], this.z + 2 * g_Renderer.vec_warp[i][2]]);
      mat4.scale(m_World, m_World, [this.time / this.max_time, this.time / this.max_time, this.time / this.max_time]);
      astMatricesUpdate();

      gl.bindTexture(gl.TEXTURE_2D, g_ParticleTexture);
      astDrawModel(g_ParticleModel);
      gl.bindTexture(gl.TEXTURE_2D, tex0);

      mat4.identity(m_World);
    }
    astMatricesUpdate();

  }

}