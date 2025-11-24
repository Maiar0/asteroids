export function angleAdjustment(x1: number, y1: number, x2: number, y2: number) {//TODO:: Not very effecient
    return Math.atan2(y2 - y1, x2 - x1)
}
export function getMaxAsteroids(points: number, level: number): number {
    const difficulty = level + Math.floor(points / 5);
    const maxAsteroids = 3 + difficulty;

    return Math.min(maxAsteroids, 30); // safety cap
}
export function getDistance(x1: number, y1: number, x2: number, y2: number) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}
export function isColliding(one: { x: number, y: number, radius: number }, two: { x: number, y: number, radius: number }) {
    const distance = getDistance(one.x, one.y, two.x, two.y);
    const rad = (one.radius + two.radius) * (one.radius + two.radius)
    return distance < rad;
}
export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = "red"; 
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}
//cleans up array of held objects that are !alive, no result of cleanup
export function cleanUp<T extends { alive: boolean }>(o: T[]): void {
    for (let i = o.length - 1; i >= 0; i--) {
        if (!o[i].alive) {//disapear
            o.splice(i, 1);
        }
    }
}