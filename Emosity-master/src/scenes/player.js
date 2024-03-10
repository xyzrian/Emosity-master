import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); 
        scene.add.existing(this);

        const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
        this.cursors = this.scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
            frameRate: 7,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start: 4, end: 6}),
            frameRate: 7,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: 'default',
            frames: [{key: 'player', frame: 3}],
            frameRate: 10
        });

    }

    create()
    {

    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        var cursors = this.cursors;
        if(cursors.left.isDown)
        {
            this.setVelocityX(-120);
            this.anims.play('left', true);
        }
        else if(cursors.right.isDown)
        {
            this.setVelocityX(120);
            this.anims.play('right', true);
        }
        else
        {
            this.setVelocityX(0);
            this.anims.play('default', true);
        }
        if(cursors.up.isDown && this.body.onFloor())
        {
            this.setVelocityY(-350); //200
            // this.setAccelerationY(-200);
        }
        else if(cursors.down.isDown)
        {
            this.setVelocityY(300);
        }
    }
}