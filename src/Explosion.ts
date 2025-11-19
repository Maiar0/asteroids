export class Explosion {
    x: number;
    y: number;
    created: number;
    alive: boolean;

    private image: HTMLImageElement;

    constructor(startX: number, startY: number, frame: number) {
        this.created = frame;
        this.alive = true;
        this.x = startX;
        this.y = startY;

        this.image = new Image();
        this.image.src = "/explosion.svg"
        //console.log("New Explosion:", this.x, this.y)
    }
    update(frame: number) {
        //console.log("explosion Update: ", this.created- frame)
        if (frame - this.created > 10) {
            this.alive = false;
        }
    }
    draw(ctx: CanvasRenderingContext2D) {

        const img = this.image;
        const w = img.width;
        const h = img.height;

        ctx.save();
        ctx.translate(this.x, this.y);   // move origin to ship position

        // Draw image centered on (0,0) in this local space
        ctx.drawImage(img, -w / 2, -h / 2);

        ctx.restore();
    }
}