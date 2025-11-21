import { Ship } from "./Ship"
import { Asteroid } from "./Asteroid"
import { Bullet } from "./Bullet";
import { Explosion } from "./Explosion";
import { drawGameOverMenu, drawLives, drawPauseMenu, drawStatsBar } from "./Menus"
import { cleanUp, getMaxAsteroids, isColliding } from "./Utils";
import type { GameState } from "./GameState";
import { input, enableInput, disableInput } from "./Input";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Game resolution (virtual)
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Physical canvas resolution
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const width = canvas.width;
const height = canvas.height;

let ship: Ship = new Ship(width / 2, height / 2);
const asteroids: Asteroid[] = [];
const bullets: Bullet[] = [];
const explosions: Explosion[] = [];
let shootCD: number = 0;
let isPaused: boolean = false;
let isGameOver: boolean = false;
let points: number = 0;
let level = 1;

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !isGameOver) {
    isPaused = true;
  }
})

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

});

function update(dt: number) {
  handleInput();
  if (isPaused) return;
  if (isGameOver) return;
  //update frame
  shootCD -= dt;
  lifeOfShip += dt;
  ship.update(dt, input, mouseX, mouseY);
  if (asteroids.length < getMaxAsteroids(points, level)) {
    console.log("Spawning asteroid", getMaxAsteroids(points, level))
    const ca = new Asteroid();
    asteroids.push(ca)
    console.log("New Asteroid: ", "X: ", ca.x, "Y: ", ca.y, ca.angle);
  }
  asteroids.forEach(e => {
    e.update(dt, frameCounter);
  });
  bullets.forEach(e => {
    e.update(dt);
  })
  explosions.forEach(e => {
    e.update(frameCounter);
  })
  //collision
  asteroids.forEach(a => {
    bullets.forEach(b => {
      //bullets
      if (isColliding(a, b)) {
        b.collided();
        a.collided(frameCounter);
      }
    })
    //player
    if (isColliding(a, ship)) {
      playerCollision();
      a.collided(frameCounter);
    }
  })
  //remove asteroids w/explosion
  for (let i = asteroids.length - 1; i >= 0; i--) {
    if (!asteroids[i].alive) {//make them blow up
      explosions.push(new Explosion(asteroids[i].x, asteroids[i].y, frameCounter))
      asteroids.splice(i, 1);
    }
  }
  cleanUp(bullets)
  cleanUp(explosions)
  //advance level
  level = 1 + Math.floor(points / 10);
}

function draw() {
  if (isPaused) {
    drawPauseMenu(ctx, width, height)
    return;
  }
  if (isGameOver) {
    drawGameOverMenu(ctx, width, height, elapsedTime, points, level);
    return;
  }
  //background
  ctx.clearRect(0, 0, width, height);
  ship.draw(ctx)
  if (asteroids.length > 0) {
    asteroids.forEach(e => {
      e.draw(ctx);
    })
  }
  if (bullets.length > 0) {
    bullets.forEach(e => {
      e.draw(ctx);
    })
  }
  if (explosions.length > 0) {
    explosions.forEach(e => {
      e.draw(ctx);
    })
  }
  drawLives(ctx, lives);
  drawStatsBar(ctx, width, points, level, elapsedTime);
}

let lives = 3;
let lifeOfShip = 0;
function playerCollision() {
  console.log("PLayerCollision: ", lifeOfShip, lives)
  if (lifeOfShip < 2) return;
  lives -= 1;
  if (lives <= 0) {
    gameOver();
    return;
  }
  ship = new Ship(width / 2, height / 2);
  lifeOfShip = 0;
}


function gameOver() {
  disableInput();
  ship = new Ship(-1100, -1100)
  isGameOver = true;
  window.addEventListener("keydown", handleRestartKey);
}

function restartGame() {
  frameCounter = 0;
  elapsedTime = 0;
  asteroids.length = 0;
  bullets.length = 0;
  explosions.length = 0;
  lives = 3;
  level = 1;
  points = 0;
  ship = new Ship(width / 2, height / 2);
  isPaused = false;
  isGameOver = false;
  window.removeEventListener("keydown", handleRestartKey);
  enableInput();

}


function handleRestartKey(e: KeyboardEvent) {
  if (e.code === "KeyR") {
    restartGame();
  }
}

function handleInput() {
  if (input.escape) {
    input.escape = false;
    isPaused = !isPaused;
    if (isPaused) {
      window.addEventListener("keydown", handleRestartKey);
    } else {
      window.removeEventListener("keydown", handleRestartKey);
    }
  }
  if (input.shoot) {
    input.shoot = false;
    if (shootCD > 0) return;
    bullets.push(new Bullet(ship.x, ship.y, ship.angle))
    shootCD = 0.25;
  }
}
function snapshotGameState(user: string): GameState {
  return {
    user,
    points,
    level,
    elapsedTime,
    ship: { x: ship.x, y: ship.y },
    lives,
    asteroids: asteroids.map(a => ({
      x: a.x,
      y: a.y,
      angle: a.angle,
      radius: a.radius
    })),
    isPaused,
    isGameOver
  };
}

function restoreGameState(state: GameState): void {
  disableInput()
  isPaused = true;
  if (state.isGameOver) {
    isPaused = false;
    gameOver()

  }
  points = state.points;
  level = state.level;
  elapsedTime = state.elapsedTime;
  lives = state.lives;
  isGameOver = state.isGameOver;

  ship = new Ship(state.ship.x, state.ship.y);

  asteroids.length = 0;
  for (const a of state.asteroids) {
    const asteroid = new Asteroid();
    asteroid.x = a.x;
    asteroid.y = a.y;
    asteroid.angle = a.angle;   // or ignore this if you want fresh directions
    asteroid.radius = a.radius;
    asteroids.push(asteroid);
  }

  bullets.length = 0;
  explosions.length = 0;
  enableInput();
}

let lastTime = 0;
let frameCounter = 0;
let elapsedTime = 0;
function loop(timestamp: number) {
  const dt = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  frameCounter += 1;
  if (!isGameOver && !isPaused) {
    elapsedTime += dt;
  }
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
enableInput();
requestAnimationFrame(loop);
