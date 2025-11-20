export function angleAdjustment(x1: number, y1: number, x2: number, y2: number) {//TODO:: Not very effecient
    return Math.atan2(y2 - y1, x2 - x1)
}