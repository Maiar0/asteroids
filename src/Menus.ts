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
export function drawGameOverMenu(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    elapsedTime: number,
    points: number,
    level: number
): void {
    ctx.save();

    // Dim the whole screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, width, height);

    // Stats panel
    const panelWidth = 320;
    const panelHeight = 200;
    const panelX = (width - panelWidth) / 2;
    const panelY = (height - panelHeight) / 2;

    ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Common text settings
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title
    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.fillText("Game Over", width / 2, panelY + 32);

    // Format time as MM:SS
    const totalSeconds = Math.floor(elapsedTime);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeText = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

    // Stats text
    ctx.font = "18px sans-serif";
    const statsCenterY = panelY + 90;
    const lineSpacing = 26;

    ctx.fillText(`Time: ${timeText}`, width / 2, statsCenterY);
    ctx.fillText(`Points: ${points}`, width / 2, statsCenterY + lineSpacing);
    ctx.fillText(`Level: ${level}`, width / 2, statsCenterY + lineSpacing * 2);

    // Hint text
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#cccccc";
    ctx.fillText(
        "Press R to restart",
        width / 2,
        panelY + panelHeight - 24
    );

    ctx.restore();
}

export function drawLives(ctx: CanvasRenderingContext2D, lives: number) {
    if (lives <= 0) return;
    const img = new Image();
    img.src = "/player_ship.svg"
    const w = img.width;
    const h = img.height;

    ctx.save();
    ctx.translate(15, 15);   // move origin to ship position

    let offset = 0;
    for (let i = lives; i > 0; --i) {
        ctx.drawImage(img, (-w / 2) + offset, -h / 2);
        offset += 20;
    }

    ctx.restore();
}

export function drawStatsBar(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    points: number,
    level: number,
    elapsedTime: number
): void {
    const padding = 10;
    const barHeight = 32;
    const barWidth = 260; // widened to fit time display

    const barX = canvasWidth - barWidth - padding;
    const barY = padding;

    // Background bar
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Border (optional)
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Text settings
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textBaseline = "middle";

    // Positions
    const centerY = barY + barHeight / 2;
    const rightTextX = barX + barWidth - padding;
    const leftTextX = barX + padding;
    const centerTextX = barX + barWidth / 2;

    // Format elapsed time as whole seconds (optional)
    const secs = Math.floor(elapsedTime);
    const timeText = `Time: ${secs}s`;

    // Level - left
    ctx.textAlign = "left";
    ctx.fillText(`Level: ${level}`, leftTextX, centerY);

    // Points - center
    ctx.textAlign = "center";
    ctx.fillText(`Points: ${points}`, centerTextX, centerY);

    // Time - right
    ctx.textAlign = "right";
    ctx.fillText(timeText, rightTextX, centerY);

    ctx.restore();
}

