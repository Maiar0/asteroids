export function drawPauseMenu(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Dim the background
    ctx.save();
    ctx.fillStyle = "rgba(117, 113, 113, 0.0)";
    ctx.fillRect(0, 0, width, height);

    // Text settings
    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("PAUSED", width / 2, height / 2 - 40);
    ctx.font = "18px sans-serif";
    ctx.fillText("Press ESC to resume", width / 2, height / 2);
    ctx.fillText("Press R to restart", width / 2, height / 2 + 30);

    ctx.restore();
}
export function drawGameOverMenu(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Dim the background
    ctx.save();
    ctx.fillStyle = "rgba(117, 113, 113, 0.3)";
    ctx.fillRect(0, 0, width, height);

    // Text settings
    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("Game Over", width / 2, height / 2 - 40);
    ctx.font = "18px sans-serif";
    ctx.fillText("Press R to restart", width / 2, height / 2 + 30);

    ctx.restore();
}
export function drawLives(ctx: CanvasRenderingContext2D, lives: number) {
    if(lives <= 0) return;
    const img = new Image();
    img.src = "/player_ship.svg"
    const w = img.width;
    const h = img.height;

    ctx.save();
    ctx.translate(15, 15);   // move origin to ship position

    let offset = 0;
    for(let i = lives ; i > 0; --i){
        ctx.drawImage(img, (-w / 2)+offset, -h / 2);
        offset += 20;
        console.log("Drawn Lives Ship")
    }

    ctx.restore();
}