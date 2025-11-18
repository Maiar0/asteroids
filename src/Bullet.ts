export class Bullet {
    x: number;
    y: number;
    angle: number; //radians
    dx: number;
    dy: number;
    alive: boolean;

    readonly radius: number;
    readonly ROTATION_OFFSET: number;
    private image: HTMLImageElement;

    constructor(startX: number, startY: number, angle:number) {
        this.alive = true;
        this.ROTATION_OFFSET = Math.PI / 2
        this.x = startX;
        this.y = startY;
        this.angle = angle;
        this.dx = Math.cos(this.angle) * 300;
        this.dy = Math.sin(this.angle) * 300;

        this.radius = 24;

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
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x+1, this.y+1);
        ctx.lineTo(this.x + this.dx * 0.05, this.y + this.dy * 0.05);
        ctx.stroke();
        ctx.restore();
    }
    collided(){
        this.alive = false;
    }
}