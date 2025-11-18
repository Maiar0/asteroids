import { Ship } from "./Ship"
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

const input = {
  thrust: false,
  brakes: false,
  left: false,
  right: false,
  shoot: false
}

window.addEventListener("keydown", (e)=>{
  if(e.code === "KeyW") input.thrust = true;
  if(e.code === "KeyS") input.brakes = true;
  if(e.code === "KeyA") input.left = true;
  if(e.code === "KeyD") input.right = true;
  if(e.code === "Space") input.shoot = true;
})

window.addEventListener("keyup", (e)=>{
  if(e.code === "KeyW") input.thrust = false;
  if(e.code === "KeyS") input.brakes = false;
  if(e.code === "KeyA") input.left = false;
  if(e.code === "KeyD") input.right = false;
  if(e.code === "Space") input.shoot = false;
})

function update(dt: number) {
    ship.update(dt, input);
}

function draw() {
  //background
    ctx.clearRect(0, 0, width, height);
    ship.draw(ctx)
}

let lastTime = 0;
function loop(timestamp: number) {
    const dt = (timestamp - lastTime) / 1000; // seconds
    lastTime = timestamp;

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
