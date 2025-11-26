import { drawCircle } from "./Utils";
export class Missile {
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
        this.radius = power > 1 ? 9 : 3;
        this.power = power;

        this.image = new Image();
        this.image.src = "/missile.svg"
    }
    update(dt: number) {
        //update
        this.x += this.dx * dt;
        this.y += this.dy * dt;

        //outofbounds rollover
        if (this.x > 832) this.alive = false;
        if (this.x < -32) this.alive = false;
        if (this.y < -32) this.alive = false;
        if (this.y > 832) this.alive = false;

    }
    draw(ctx: CanvasRenderingContext2D) {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            // Fallback: simple triangle if image not yet loaded
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-12, -8);
            ctx.lineTo(-12, 8);
            ctx.closePath();

            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.restore();
            return;
        }
        //drawCircle(ctx,this.x,this.y,this.radius)//debug collision
        const img = this.image;
        const w = img.width;
        const h = img.height;

        ctx.save();
        ctx.translate(this.x, this.y);   // move origin to ship position

        ctx.rotate(this.angle + this.ROTATION_OFFSET);          // rotate around that origin

        // Draw image centered on (0,0) in this local space
        ctx.drawImage(img, -w / 2, -h / 2);

        ctx.restore();
    }

    collided() {
        //lives all the way tell edge
    }
}