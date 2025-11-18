import { Ship } from "./Ship"
import { Asteroid } from "./Asteroid"
import { Bullet } from "./Bullet";
import { Explosion } from "./Explosion";

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

const ship = new Ship(width / 2, height / 2);
const asteroids: Asteroid[] = [];
const bullets: Bullet[] = [];
const explosions: Explosion[] = [];
let shootCD: number = 0;


const input = {
  thrust: false,
  brakes: false,
  left: false,
  right: false,
  shoot: false
}

window.addEventListener("keydown", (e) => {
  if (e.code === "KeyW") input.thrust = true;
  if (e.code === "KeyS") input.brakes = true;
  if (e.code === "KeyA") input.left = true;
  if (e.code === "KeyD") input.right = true;
})

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyW") input.thrust = false;
  if (e.code === "KeyS") input.brakes = false;
  if (e.code === "KeyA") input.left = false;
  if (e.code === "KeyD") input.right = false;
  if (e.code === "Space") shoot();
})

function update(dt: number) {
  //update frame
  shootCD -= dt;
  ship.update(dt, input);
  if (asteroids.length < 10) {
    const ca = new Asteroid();
    asteroids.push(ca)
    console.log("New Asteroid: ", "X: ", ca.x, "Y: ", ca.y, ca.angle);
  }
  asteroids.forEach(e => {
    e.update(dt, framCounter);
  });
  bullets.forEach(e => {
    e.update(dt);
  })
  explosions.forEach(e=>{
    e.update(framCounter);
  })
  //collision
  asteroids.forEach(a => {
    bullets.forEach(b => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = dx * dx + dy * dy;
      if (dist < a.radius * a.radius) {
        b.collided();
        a.collided(framCounter);
      }
    })
    const dx = ship.x -a.x;
    const dy = ship.y - a.y;
    const dist = dx*dx + dy*dy;
    if(dist < a.radius * a.radius){
      a.collided(framCounter);
      ship.collided();
    }
  })
  //remove asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    if (!asteroids[i].alive) {//make them blow up
      explosions.push(new Explosion(asteroids[i].x,asteroids[i].y,framCounter ))
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
  if(explosions.length > 0){
    explosions.forEach(e =>{
      e.draw(ctx);
    })
  }
}

function shoot() {
  if (shootCD > 0) return;
  bullets.push(new Bullet(ship.x, ship.y, ship.angle))
  shootCD = 0.25;
}

let lastTime = 0;
let framCounter = 0;
function loop(timestamp: number) {
  const dt = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  framCounter += 1;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
