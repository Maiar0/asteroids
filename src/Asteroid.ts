import { angleAdjustment, drawCircle } from "./Utils"
export class Asteroid {
   x: number;
   y: number;
   angle: number; //radians
   velocity: number;
   dx: number;
   dy: number;
   active: boolean;
   alive: boolean;
   Phase: Record<number, HTMLImageElement>;
   lifeCycle: number;
   radius: number;
   lastCollision: number;

   readonly ROTATION_OFFSET: number;

   private image_small: HTMLImageElement;
   private image_medium: HTMLImageElement;
   private image_large: HTMLImageElement;

   constructor() {
      this.alive = true;
      this.ROTATION_OFFSET = 0;
      const pos = this.initPos();
      this.x = pos.x;
      this.y = pos.y;
      const y2 = Math.random() * (600);
      const x2 = Math.random() * (800);
      console.log("interior random point: ", x2, y2);
      this.angle = angleAdjustment(this.x, this.y, x2, y2);
      this.velocity = 100;
      this.dx = 0;
      this.dy = 0;
      this.active = false;
      this.lifeCycle = 0;

      this.radius = this.initradius();
      this.lastCollision = 0;

      this.image_small = new Image();
      this.image_small.src = "/asteroids/asteroid_small.svg"
      this.image_medium = new Image();
      this.image_medium.src = "/asteroids/asteroid_medium.svg"
      this.image_large = new Image();
      this.image_large.src = "/asteroids/asteroid_large.svg"

      this.Phase = {
         14: this.image_small,
         22: this.image_medium,
         37: this.image_large
      };

   }
   update(dt: number, framCounter: number) {
      this.lifeCycle = framCounter;
      //offscreen for 1 ish second before movement begins
      if (this.lifeCycle > 60 && this.active === false) {
         this.active = true;
         this.dx = Math.cos(this.angle) * this.velocity;
         this.dy = Math.sin(this.angle) * this.velocity;
      }
      //update
      this.x += this.dx * dt;
      this.y += this.dy * dt;

      //bounds check
      if (this.x > 832) this.x = -32;
      if (this.x < -32) this.x = 832;
      if (this.y < -32) this.y = 632;
      if (this.y > 632) this.y = -32;
   }

   draw(ctx: CanvasRenderingContext2D) {
      const image = this.Phase[this.radius];
      if (!image.complete || image.naturalWidth === 0) {
         drawCircle(ctx, this.x,this.y,this.radius);
         return;
      }
      //drawCircle(ctx,this.x,this.y,this.radius)//debug collision
      const img = image;
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
      console.log("initPos:", choice);
      return choice;
   }
   initradius(): number {
      const rand: number = Math.random()
      if (rand > 0 && rand <= .33) return 14;
      if (rand > .33 && rand <= .66) return 22;
      if (rand > .66 && rand <= 1.0) return 37;
      return 22;
   }

   collided(frame: number) {
      console.log(frame, this.lastCollision, this.radius)
      if (frame - this.lastCollision < 10) return;
      if (this.radius === 14) {
         this.alive = false;
      }
      if (this.radius === 22) {
         this.radius = 14;
      }
      if (this.radius === 37) {
         this.radius = 22;
      }
      console.log(this.radius)
      this.lastCollision = frame;
   }
}