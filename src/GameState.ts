export interface GameState {
    user: string;
    points: number;
    level: number;
    elapsedTime: number;
    ship: { x: number, y: number };
    lives: number;
    asteroids: { x: number, y: number, angle: number, radius: number}[];
    isPaused: boolean;
    isGameOver: boolean;
}
