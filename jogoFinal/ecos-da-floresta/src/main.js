import kaplay from "kaplay";

// ==================================================
// CONFIGURAÇÃO DO JOGO
// ==================================================

kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  background: [20, 35, 30],
});

// Gravidade
setGravity(1600);

// ==================================================
// CENÁRIO
// ==================================================

loadSprite(
  "background",
  "/assets/background/fase2_background_far.png"
);

loadSprite(
  "foreground",
  "/assets/background/fase2_foreground_playable.png"
);

// ==================================================
// PERSONAGEM
// ==================================================
//
// Ordem:
//
// 0 - 3   = idle
// 4 - 7   = walk
// 8 - 11  = run
// 12 - 13 = jump
// 14 - 17 = attack
// 18 - 19 = hurt
//
// ==================================================

loadSprite(
  "player",
  [
    // IDLE
    "/assets/personagem/idle/idle_01.png",
    "/assets/personagem/idle/idle_02.png",
    "/assets/personagem/idle/idle_03.png",
    "/assets/personagem/idle/idle_04.png",

    // WALK
    "/assets/personagem/walk/walk_01.png",
    "/assets/personagem/walk/walk_02.png",
    "/assets/personagem/walk/walk_03.png",
    "/assets/personagem/walk/walk_04.png",

    // RUN
    "/assets/personagem/run/run_01.png",
    "/assets/personagem/run/run_02.png",
    "/assets/personagem/run/run_03.png",
    "/assets/personagem/run/run_04.png",

    // JUMP
    "/assets/personagem/jump/jump_01.png",
    "/assets/personagem/jump/jump_02.png",

    // ATTACK
    "/assets/personagem/attack/attack_01.png",
    "/assets/personagem/attack/attack_02.png",
    "/assets/personagem/attack/attack_03.png",
    "/assets/personagem/attack/attack_04.png",

    // HURT
    "/assets/personagem/hurt/hurt_01.png",
    "/assets/personagem/hurt/hurt_02.png",
  ],

  {
    anims: {
      idle: {
        from: 0,
        to: 3,
        loop: true,
        speed: 4,
      },

      walk: {
        from: 4,
        to: 7,
        loop: true,
        speed: 8,
      },

      run: {
        from: 8,
        to: 11,
        loop: true,
        speed: 11,
      },

      jump: {
        from: 12,
        to: 13,
        loop: true,
        speed: 4,
      },

      attack: {
        from: 14,
        to: 17,
        loop: false,
        speed: 10,
      },

      hurt: {
        from: 18,
        to: 19,
        loop: false,
        speed: 6,
      },
    },
  }
);

// ==================================================
// BACKGROUND
// ==================================================

add([
  sprite("background", {
    width: 1280,
    height: 720,
  }),

  pos(0, 0),
]);

// ==================================================
// FOREGROUND
// ==================================================

add([
  sprite("foreground", {
    width: 1280,
    height: 720,
  }),

  pos(0, 0),
]);

// ==================================================
// CHÃO INVISÍVEL
// ==================================================

const GROUND_Y = 600;

add([
  rect(1280, 120),

  pos(0, GROUND_Y),

  area(),

  body({
    isStatic: true,
  }),

  opacity(0),

  "ground",
]);

// ==================================================
// PERSONAGEM
// ==================================================

const player = add([
  sprite("player", {
    anim: "idle",
  }),

  pos(250, 480),

  anchor("center"),

  scale(0.8),

  // Caixa física menor que a imagem.
  // Evita cabelo e flores entrarem na colisão.
  area({
    scale: vec2(0.35, 0.52),
    offset: vec2(0, 42),
  }),

  body(),

  "player",
]);

// ==================================================
// CONFIGURAÇÕES
// ==================================================

const WALK_SPEED = 250;
const RUN_SPEED = 400;
const JUMP_FORCE = 650;

let currentAnimation = "idle";

let attacking = false;
let hurt = false;

// ==================================================
// TROCAR ANIMAÇÃO
// ==================================================

function changeAnimation(animation) {

  if (currentAnimation === animation) {
    return;
  }

  player.play(animation);

  currentAnimation = animation;
}

// ==================================================
// PULO
// ==================================================

function jump() {

  if (
    player.isGrounded() &&
    !attacking &&
    !hurt
  ) {

    player.jump(JUMP_FORCE);

    changeAnimation("jump");
  }
}

// Espaço
onKeyPress("space", () => {
  jump();
});

// W
onKeyPress("w", () => {
  jump();
});

// Seta para cima
onKeyPress("up", () => {
  jump();
});

// ==================================================
// ATAQUE
// ==================================================

function attack() {

  if (
    attacking ||
    hurt ||
    !player.isGrounded()
  ) {
    return;
  }

  attacking = true;

  currentAnimation = "attack";

  player.play("attack");
}

// F
onKeyPress("f", () => {
  attack();
});

// E
onKeyPress("e", () => {
  attack();
});

// ==================================================
// HURT
// ==================================================
//
// H é temporário para testar.
//
// Depois o Curupira ou outro inimigo
// vai chamar essa animação.
//
// ==================================================

onKeyPress("h", () => {

  if (
    hurt ||
    attacking
  ) {
    return;
  }

  hurt = true;

  currentAnimation = "hurt";

  player.play("hurt");
});

// ==================================================
// FIM DAS ANIMAÇÕES
// ==================================================

player.onAnimEnd((animation) => {

  // --------------------------
  // ATTACK
  // --------------------------

  if (animation === "attack") {

    attacking = false;

    currentAnimation = "";

    if (player.isGrounded()) {
      changeAnimation("idle");
    }
  }

  // --------------------------
  // HURT
  // --------------------------

  if (animation === "hurt") {

    hurt = false;

    currentAnimation = "";

    if (player.isGrounded()) {
      changeAnimation("idle");
    }
  }
});

// ==================================================
// MOVIMENTAÇÃO
// ==================================================

onUpdate(() => {

  // Não interrompe ataque ou dano
  if (attacking || hurt) {
    return;
  }

  let moving = false;

  const running = isKeyDown("shift");

  const speed = running
    ? RUN_SPEED
    : WALK_SPEED;

  // ==================================================
  // ESQUERDA
  // ==================================================

  if (
    isKeyDown("left") ||
    isKeyDown("a")
  ) {

    player.move(-speed, 0);

    player.flipX = true;

    moving = true;
  }

  // ==================================================
  // DIREITA
  // ==================================================

  if (
    isKeyDown("right") ||
    isKeyDown("d")
  ) {

    player.move(speed, 0);

    player.flipX = false;

    moving = true;
  }

  // ==================================================
  // LIMITES DA TELA
  // ==================================================

  if (player.pos.x < 70) {
    player.pos.x = 70;
  }

  if (player.pos.x > 1210) {
    player.pos.x = 1210;
  }

  // ==================================================
  // JUMP
  // ==================================================

  if (!player.isGrounded()) {

    changeAnimation("jump");

    return;
  }

  // ==================================================
  // RUN
  // ==================================================

  if (
    moving &&
    running
  ) {

    changeAnimation("run");

    return;
  }

  // ==================================================
  // WALK
  // ==================================================

  if (moving) {

    changeAnimation("walk");

    return;
  }

  // ==================================================
  // IDLE
  // ==================================================

  changeAnimation("idle");
});