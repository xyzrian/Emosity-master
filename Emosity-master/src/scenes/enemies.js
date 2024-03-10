import Phaser from 'phaser'

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); 
        scene.add.existing(this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('enemies', {start: 1, end: 1}),
            frameRate: 7,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('enemies', {start: 0, end: 0}),
            frameRate: 7,
            repeat: -1,
            yoyo: true
        });

    }

    create()
    {

    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        if(this.body.touching.right || this.body.blocked.right)
        {
            this.setVelocityX(-50);
            this.anims.play('left', true);
        }
        else if(this.body.touching.left || this.body.blocked.left)
        {
            this.setVelocityX(50);
            this.anims.play('right', true);
        }
    }
}