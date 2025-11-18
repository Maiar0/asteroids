export class Asteroid {
   x: number;
   y: number;
   angle: number; //radians
   dx: number;
   dy: number;
   size: number;
   inplay: boolean;
   Phase: Record<number, HTMLImageElement>;

   readonly radius: number;
   readonly velocity: number;
   readonly ROTATION_OFFSET: number;

   private image_small: HTMLImageElement;
   private image_medium: HTMLImageElement;
   private image_large: HTMLImageElement;

   constructor() {
      this.ROTATION_OFFSET = Math.PI / 2
      this.x = 400;
      this.y = 300;
      this.angle = 0;
      this.dx = 100;
      this.dy = 100;
      this.size = 1;
      this.inplay = false;

      this.radius = 24;
      this.velocity = 200;

      this.image_small = new Image();
      this.image_small.src = "/asteroid_small.svg"
      this.image_medium = new Image();
      this.image_medium.src = "/asteroid_medium.svg"
      this.image_large = new Image();
      this.image_large.src = "/asteroid_large.svg"

      this.Phase = {
         1: this.image_small,
         2: this.image_medium,
         3: this.image_large
      };

   }
   create() {
      const x = this.initX();
      const y  = this.initY();
      const size = this.initSize();
      //const angle = Math.atan2(y2 - y1, x2 - x1);
      const x2 = this.initX();
      const y2 = this.initY();
      const angle = Math.atan2(y2 - y, x2 - x)
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.size = size;
      return this;
   }
   initX(): number {
      const options = {
         1: -32 - (Math.random() * (100 - 32)),
         2: 832 + (Math.random() * (900 - 832))
      }
      return options[Math.random() > .5 ? 1 : 2]
   }
   initY():number {
      const options = {
         1: -32 - (Math.random() * (100 - 32)),
         2: 632 + (Math.random() * (700 - 632))
      }
      return options[Math.random() > .5 ? 1 : 2]
   }
   initSize(): number {
      const rand: number = Math.random()
      if (rand > 0 && rand <= .33) return 1;
      if (rand > .33 && rand <= .66) return 2;
      if (rand > .66 && rand <= 1.0) return 3;
      return 1;
   }
   update(dt: number){
      //update
      this.x += this.dx*dt;
      this.y += this.dy*dt;
   }
   draw(ctx: CanvasRenderingContext2D) {
      const image = this.Phase[this.size];
      if (!image.complete || image.naturalWidth === 0) {
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

      const img = image;
      const w = img.width;
      const h = img.height;

      ctx.save();
      ctx.translate(this.x, this.y);   // move origin to ship position

      ctx.rotate(this.angle + this.ROTATION_OFFSET);          // rotate around that origin

      // Draw image centered on (0,0) in this local space
      ctx.drawImage(img, -w / 2, -h / 2);

      ctx.restore();
   }
}