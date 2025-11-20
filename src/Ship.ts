export class Ship {
   x: number;
   y: number;
   angle: number; //radians
   dx: number;
   dy: number;

   readonly radius: number;
   readonly velocity: number;
   readonly friction: number;
   readonly maxSpeed: number;
   readonly ROTATION_OFFSET: number;
   private image: HTMLImageElement;

   constructor(startX: number, startY: number) {
      this.ROTATION_OFFSET = Math.PI / 2
      this.x = startX;
      this.y = startY;
      this.angle = -Math.PI / 2;
      this.dx = 0;
      this.dy = 0;

      this.radius = 24;
      this.velocity = 200;
      this.friction = 0.8;
      this.maxSpeed = 400;

      this.image = new Image();
      this.image.src = "/player_ship.svg"
   }

   update(dt: number, input: { thrust: boolean; brakes: boolean; left: boolean; right: boolean; }) {
      const dr = 3;//rotaiton speed
      if (input.left) {
         this.angle -= dr * dt;
      }
      if (input.right) {
         this.angle += dr * dt;
      }
      if (input.thrust || input.brakes) {
         const adj_vel: number = input.thrust ? this.velocity : -this.velocity;
         const ax = Math.cos(this.angle) * adj_vel;
         const ay = Math.sin(this.angle) * adj_vel;

         this.dx += ax * dt;
         this.dy += ay * dt;

      } else {
         const damping = Math.max(0, 1 - this.friction * dt);
         this.dx *= damping;
         this.dy *= damping;
      }

      //clamp speed
      const speed = Math.hypot(this.dx, this.dy);
      if (speed > this.maxSpeed) {
         const scale = this.maxSpeed / speed;
         this.dx *= scale;
         this.dy *= scale;
      }
      //eliminate low speed drift
      if (speed < 1) {
         this.dx = 0;
         this.dy = 0;
      }
      //update
      this.x += this.dx * dt;
      this.y += this.dy * dt;

      //outofbounds rollover
      if (this.x > 800) this.x = 0;
      if (this.x < 0) this.x = 800;
      if (this.y < 0) this.y = 600;
      if (this.y > 600) this.y = 0;

      //console.log("x: ", this.x, "y: ", this.y)
      //console.log("dx: ", this.dx, "dy: ", this.dy, "speed: ", speed)
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
      console.log("Ship collided")
   }
}