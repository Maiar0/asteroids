import { angleAdjustment, drawCircle, getDistance } from "./Utils"
export class Powerup {
    x: number;
    y: number;
    angle: number; //radians
    velocity: number;
    dx: number;
    dy: number;
    alive: boolean;
    Type: Record<number, HTMLImageElement>;
    radius: number;
    imageType: number;

    readonly ROTATION_OFFSET: number;

    private image_red: HTMLImageElement;
    private image_yellow: HTMLImageElement;
    private image_green: HTMLImageElement;
    private image: HTMLImageElement;

    constructor() {
        this.alive = true;
        this.ROTATION_OFFSET = 0;
        const pos = this.initPos();
        this.x = pos.x;
        this.y = pos.y;
        const y2 = Math.random() * (600);
        const x2 = Math.random() * (800);
        this.angle = angleAdjustment(this.x, this.y, x2, y2);
        this.velocity = 100;
        this.dx = 100;
        this.dy = 100;

        this.radius = 20;

        this.image_red = new Image();
        this.image_red.src = "/powerups/red_alien.svg"
        this.image_yellow = new Image();
        this.image_yellow.src = "/powerups/yellow_alien.svg"
        this.image_green = new Image();
        this.image_green.src = "/powerups/green_alien.svg"

        this.Type = {
            1: this.image_red,
            2: this.image_yellow,
            3: this.image_green
        };
        this.imageType = this.initType();
        this.image = this.Type[this.imageType]
        console.log("Spawn Powerup: ", this.x, this.y)

    }
    update(dt: number) {
        //update
        this.x += this.dx * dt + 1;
        this.y += this.dy * dt - 1;

        //bounds check
        if (this.x > 832) this.x = -32;
        if (this.x < -32) this.x = 832;
        if (this.y < -32) this.y = 632;
        if (this.y > 632) this.y = -32;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            drawCircle(ctx, this.x, this.y, this.radius);
            return;
        }
        drawCircle(ctx, this.x, this.y, this.radius)//debug collision
        const img = this.image;
        const w = img.width;
        const h = img.height;

        ctx.save();
        ctx.translate(this.x, this.y);   // move origin to ship position

        // Draw image centered on (0,0) in this local space
        ctx.drawImage(img, -w / 2, -h / 2);

        ctx.restore();
    }

    initPos(): { x: number; y: number } {
        let spawnAreas = [
            { x: (-100 + Math.random() * (800 + 100)), y: (-32 - Math.random() * (100 - 32)) },
            { x: (-100 + Math.random() * (800 + 100)), y: (632 + Math.random() * (700 - 632)) },
            { x: (-32 - Math.random() * (100 - 32)), y: (-100 + Math.random() * (600 + 100)) },
            { x: (832 + Math.random() * (900 - 832)), y: (-100 + Math.random() * (600 + 100)) }
        ]
        const choice = spawnAreas[Math.floor(Math.random() * 4)];
        return choice;
    }
    initType(): number {
        return Math.floor(Math.random() * 3) + 1;
    }

    collided(): number {
        this.alive = false;
        return this.imageType;
    }
}