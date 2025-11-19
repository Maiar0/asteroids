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