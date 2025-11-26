export class PowerupManager {
    elapsedTime: number;

    baseBulletType: number;
    baseShipSpeed: number;

    bulletActive: boolean;
    bulletTimer: number;
    bulletType: number;

    shipActive: boolean;
    shipSpeed: number;
    shipMultiplier: number;
    shipTimer: number;


    constructor(bullet: number, shipSpeed: number) {
        this.elapsedTime = 0;
        this.baseBulletType = bullet;
        this.baseShipSpeed = shipSpeed

        this.bulletActive = false;
        this.bulletTimer = 0;
        this.bulletType = bullet;

        this.shipActive = false;
        this.shipMultiplier = 1.5;
        this.shipSpeed = shipSpeed;
        this.shipTimer = 0;
    }

    update(dt: number) {
        this.elapsedTime += dt;
        this.bulletTimer -= dt;
        this.shipTimer -= dt;

        if (this.shipTimer <= 0) {
            this.shipActive = false;
        }
        if (this.bulletTimer <= 0) {
            this.bulletActive = false;
        }
        if(this.shipActive){
            this.shipSpeed = this.baseShipSpeed * this.shipMultiplier;
        }else{
            this.shipSpeed = this.baseShipSpeed;
        }
        if(this.bulletActive){
            this.bulletType = 2;
        }else{
            this.bulletType = 1;
        }
    }

    applyPowerups(): {
        shipSpeed: number,
        bulletType: number
    } {
        
        return {
            shipSpeed: this.shipSpeed,
            bulletType: this.bulletType
        };
    }
    shotRedAlien(){
        if(this.bulletActive){
            this.bulletTimer += 5;
            return;
        }
        this.bulletActive = true;
        this.bulletTimer = 10;
        this.bulletType = 2;//Type of bullet maybe we should formalize this kind of messy.
        console.log("Shot Red Alien", this.bulletActive, this.bulletTimer, this.bulletType)
    }
    shotYellowAlien(){
        if(this.shipActive){
            this.shipTimer += 10;
            return
        }
        this.shipActive = true;
        this.shipMultiplier = 1.2;
        this.shipTimer = 10;
    }
    shotGreenAlien(){
        //Duno what power this will give.
    }
}