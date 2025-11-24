import { drawCircle } from "./Utils";

export class Bullet {
    x: number;
    y: number;
    angle: number; //radians
    dx: number;
    dy: number;
    alive: boolean;
    power: number;

    readonly radius: number;
    readonly ROTATION_OFFSET: number;
    private image: HTMLImageElement;

    constructor(startX: number, startY: number, angle: number, power: number = 1) {
        this.alive = true;
        this.ROTATION_OFFSET = Math.PI / 2
        this.x = startX;
        this.y = startY;
        this.angle = angle;
        this.dx = Math.cos(this.angle) * 300;
        this.dy = Math.sin(this.angle) * 300;
        this.radius = (power * 3);
        this.power = power;

        this.image = new Image();
        this.image.src = "/player_ship.svg"
    }
    update(dt: number) {
        //update
        this.x += this.dx * dt;
        this.y += this.dy * dt;

        //outofbounds rollover
        if (this.x > 800) this.alive = false;
        if (this.x < 0) this.alive = false;
        if (this.y < 0) this.alive = false;
        if (this.y > 600) this.alive = false;

    }
    draw(ctx: CanvasRenderingContext2D) {
        const padding = 5;
        const right = this.offsetRightFromAngle(this.x,this.y,this.angle,padding)
        const left = this.offsetLeftFromAngle(this.x,this.y,this.angle,padding)
        ctx.save();
        switch(this.power){
            case 1:
                this.drawLine(ctx, this.x, this.y, this.dx, this.dy, 2)
                break;
            case 2:
                this.drawLine(ctx, right.x, right.y, this.dx, this.dy, 2)
                this.drawLine(ctx, this.x, this.y, this.dx, this.dy, 2)
                break;
            case 3:
                this.drawLine(ctx, left.x, left.y, this.dx, this.dy, 2)
                this.drawLine(ctx, this.x, this.y, this.dx, this.dy, 2)
                this.drawLine(ctx, right.x, right.y, this.dx, this.dy, 2)
                break;
            default:
                this.drawLine(ctx, this.x, this.y, this.dx, this.dy, 2)
                break;

        }
        this.drawLine(ctx, right.x, right.y, this.dx, this.dy, 2)

        drawCircle(ctx, this.x, this.y, this.radius)//debug collision
        ctx.restore();
    }
    drawLine(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        dx: number,
        dy: number,
        width: number = 2,
        color: string = "#ffffff"
    ): void {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx * 0.05, y + dy * 0.05);
        ctx.stroke();
    }
    offsetRightFromAngle(
        x: number,
        y: number,
        angle: number,
        sideOffset: number
    ): { x: number; y: number } {
        const fx = Math.cos(angle);
        const fy = Math.sin(angle);

        // right-hand (clockwise) perpendicular
        const rx = fy;
        const ry = -fx;

        return {
            x: x + rx * sideOffset,
            y: y + ry * sideOffset,
        };
    }
    offsetLeftFromAngle(
        x: number,
        y: number,
        angle: number,
        sideOffset: number
    ): { x: number; y: number } {
        const fx = Math.cos(angle);
        const fy = Math.sin(angle);

        // left-hand (counter-clockwise) perpendicular
        const lx = -fy;
        const ly = fx;

        return {
            x: x + lx * sideOffset,
            y: y + ly * sideOffset,
        };
    }

    collided() {
        this.alive = false;
    }
}