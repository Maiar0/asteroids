import { Ship } from "./Ship"
import { Asteroid } from "./Asteroid"
import { Bullet } from "./Bullet";
import { Explosion } from "./Explosion";
import { drawGameOverMenu, drawLives, drawPauseMenu } from "./Menus"

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

document.addEventListener("visibilitychange", () => {
  if(document.hidden){
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
  if (isPaused) return;
  if (isGameOver) return;
  //update frame
  shootCD -= dt;
  lifeOfShip += dt;
  ship.update(dt, input, mouseX, mouseY);
  if (asteroids.length < 10) {
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
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = dx * dx + dy * dy;
      if (dist < a.radius * a.radius) {
        b.collided();
        a.collided(frameCounter);
      }
    })
    const dx = ship.x - a.x;
    const dy = ship.y - a.y;
    const dist = dx * dx + dy * dy;
    if (dist < a.radius * a.radius) {
      playerCollision();
      a.collided(frameCounter);
    }
  })
  //remove asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    if (!asteroids[i].alive) {//make them blow up
      explosions.push(new Explosion(asteroids[i].x, asteroids[i].y, frameCounter))
      asteroids.splice(i, 1);
    }
  }
  //remove bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (!bullets[i].alive) {//disapear
      bullets.splice(i, 1);
    }
  }
  for (let i = explosions.length - 1; i >= 0; i--) {
    if (!explosions[i].alive) {//disapear
      explosions.splice(i, 1);
    }
  }
}

function draw() {
  if (isPaused) {
    drawPauseMenu(ctx, width, height)
    return;
  }
  if (isGameOver) {
    drawGameOverMenu(ctx, width, height);
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
  isGameOver = true;
  disableInput();
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "KeyR") {
      restartGame();
    }
  });
  ship = new Ship(-1100, -1100)
}

function restartGame() {
  lastTime = 0;
  frameCounter = 0;
  asteroids.length = 0;
  bullets.length = 0;
  explosions.length = 0;
  lives = 3;
  ship = new Ship(width / 2, height / 2);
  isGameOver = false;
  window.removeEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "KeyR") {
      restartGame();
    }
  });
  enableInput();

}

const input = {
  thrust: false,
  brakes: false,
  left: false,
  right: false,
  shoot: false,
  escape: false
}

function onKeyDown(e: KeyboardEvent): void {
  switch (e.code) {
    case "KeyW": input.thrust = true; break;
    case "KeyS": input.brakes = true; break;
    case "KeyA": input.left = true; break;
    case "KeyD": input.right = true; break;
    case "Escape": escapePress(); break;
    default: break;
  }
}

function onKeyUp(e: KeyboardEvent): void {
  switch (e.code) {
    case "KeyW": input.thrust = false; break;
    case "KeyS": input.brakes = false; break;
    case "KeyA": input.left = false; break;
    case "KeyD": input.right = false; break;
    case "Space": shoot(); break;
    default: break;
  }
}

export function enableInput(): void {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

export function disableInput(): void {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
}

function escapePress() {
  isPaused = !isPaused;
}

function shoot() {
  if (shootCD > 0) return;
  bullets.push(new Bullet(ship.x, ship.y, ship.angle))
  shootCD = 0.25;
}

let lastTime = 0;
let frameCounter = 0;
function loop(timestamp: number) {
  const dt = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  frameCounter += 1;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
enableInput();
requestAnimationFrame(loop);
