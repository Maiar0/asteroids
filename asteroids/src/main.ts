const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const width = canvas.width;
const height = canvas.height;

function update(dt: number) {
    // Nothing to update yet
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw 4x4 red square in the center
    ctx.fillStyle = "red";
    ctx.fillRect(width / 2 - 2, height / 2 - 2, 4, 4);
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
