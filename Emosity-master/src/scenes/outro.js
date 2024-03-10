import Phaser from 'phaser'

var windowWidth = 480;
var windowHeight = 270;

export default class Outro extends Phaser.Scene {
    constructor() {
        super('Outro');
    }

    preload () 
    {

    }

    create ()
    {
        this.add.sprite(0, 0, 'playerIntro').setOrigin(0, 0);

        this.input.on('pointerdown', function() {
            this.scene.switch('Game');
        }, this);
    }

    update ()
    {

    }
}
