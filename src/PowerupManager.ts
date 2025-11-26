export class PowerupManager {

    baseBulletType: number;
    baseShootCD: number;
    baseShipSpeed: number;

    bulletActive: boolean;
    bulletTimer: number;
    bulletType: number;

    shipActive: boolean;
    shipSpeed: number;
    shipMultiplier: number;
    shipTimer: number;

    shootCD: number;

    lives: number;

    constructor(bullet: number, shipSpeed: number, baseShootCD: number) {
        this.baseBulletType = bullet;
        this.baseShipSpeed = shipSpeed
        this.baseShootCD = baseShootCD;

        this.shootCD = baseShootCD;

        this.bulletActive = false;
        this.bulletTimer = 0;
        this.bulletType = bullet;

        this.shipActive = false;
        this.shipMultiplier = 1.5;
        this.shipSpeed = shipSpeed;
        this.shipTimer = 0;

        this.lives = 0;
    }

    update(dt: number) {
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
        bulletType: number,
        addLives: number,
        shootCD: number
    } {
        let addLives = this.lives;
        this.lives = 0;
        return {
            shipSpeed: this.shipSpeed,
            bulletType: this.bulletType,
            addLives: addLives,
            shootCD: this.shootCD
        };
    }
    shotRedAlien(){
        if(this.bulletActive){
            this.bulletTimer += 5;
            this.shootCD = this.baseShootCD * 0.5;
            return;
        }
        this.bulletActive = true;
        this.bulletTimer = 10;
        this.bulletType = 2;//Type of bullet maybe we should formalize this kind of messy.
        console.log("Shot Red Alien", this.bulletActive, this.bulletTimer, this.bulletType)
    }
    shotYellowAlien(){
        //add amunition
    }
    shotGreenAlien(){
        //adds one life
        this.lives +=1;
    }
}