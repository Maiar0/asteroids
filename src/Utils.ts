export function angleAdjustment(x1: number, y1: number, x2: number, y2: number) {//TODO:: Not very effecient
    return Math.atan2(y2 - y1, x2 - x1)
}
export 
function getMaxAsteroids(points: number, level: number): number {
    const difficulty = level + Math.floor(points / 5);
    const maxAsteroids = 3 + difficulty;

    return Math.min(maxAsteroids, 30); // safety cap
}