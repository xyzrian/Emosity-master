import Phaser from 'phaser'

var windowWidth = 480;
var windowHeight = 270;

export default class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'Boot',
            pack: {
                files: [{
                    key: 'loading',
                    type: 'spritesheet',
                    url: 'src/assets/loading.png',
                    frameConfig: {
                        frameWidth: 84, 
                        frameHeight: 12
                    }
                }, 
                {
                    type: 'image',
                    key: 'logo',
                    url: 'src/assets/logo.png'
                }]
            }
        });
    }

    preload ()
    {
        const loadingMessage = this.add.sprite(windowWidth/2, windowHeight/2, 'loading');
        this.anims.create({
            key: 'loading',
            frames: this.anims.generateFrameNumbers('loading'),
            frameRate: 5,
            repeat: -1,
        });

        loadingMessage.anims.play('loading', true);

        this.load.on('complete', function(file) {
            loadingMessage.destroy();
        });

        this.load.spritesheet('player', 'src/assets/player1.png', { frameWidth: 42, frameHeight: 76 }); 
        this.load.image('playerIntro', 'src/assets/playerIntro.png');
        this.load.image('blackBg', 'src/assets/blackBg.png');
        this.load.image('sky', 'src/assets/sky.png');
        this.load.image('cloudsLarge', 'src/assets/cloudsLarge.png');
        this.load.image('cloudsMedium', 'src/assets/cloudsMedium.png');
        this.load.image('cloudsSmall', 'src/assets/cloudsSmall.png');
        this.load.image('logo', 'src/assets/logo.png' )
        this.load.image('house', 'src/assets/house.png');

        // this.load.tilemapTiledJSON('map', 'src/assets/testmap.json');
        this.load.tilemapTiledJSON('map', 'src/assets/mapv1_1.json');
        this.load.image('grasstiles', 'src/assets/grasstileset.png');
        this.load.spritesheet('records', 'src/assets/records.png', { frameWidth: 19, frameHeight: 12, startFrame: 0, endFrame: 10});
        this.load.spritesheet('decor', 'src/assets/decor.png', { frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.image('walls', 'src/assets/wall.png');
        this.load.image('ladders', 'src/assets/ladder.png');

        this.load.image('inventoryIcon', 'src/assets/inventoryIcon.png');
        this.load.spritesheet('buttons', 'src/assets/buttons.png', { frameWidth: 25, frameHeight: 25, startFrame: 0, endFrame: 1});

        this.load.atlas('musicNotes', 'src/assets/musicNotes.png', 'src/assets/musicNotes.json');
        this.load.atlas('deathParticles', 'src/assets/deathParticles.png', 'src/assets/deathParticles.json');

        this.load.image('respawnButton', 'src/assets/respawnButton.png');

        this.load.spritesheet('enemies', 'src/assets/enemy.png', { frameWidth: 27, frameHeight: 30, startFrame: 0, endFrame: 1 });

        this.load.audio('blackMusic', ['src/assets/LateAtNight.mp3']);
        this.load.audio('redMusic', ['src/assets/ElevatorMusic.mp3']);
        this.load.audio('yellowMusic', ['src/assets/ForestWalk.mp3']);
        this.load.audio('blueMusic', ['src/assets/marimbamagic.mp3']);
        this.load.audio('mixedbluetealMusic', ['src/assets/LateAtNight.mp3']);
        this.load.audio('mixedbluepinkMusic', ['src/assets/MelodyOfNature.mp3']);
        this.load.audio('brokenMusic', ['src/assets/Clown.mp3']);
        this.load.audio('orangeMusic', ['src/assets/GoodFellow.mp3']);
        this.load.audio('greenMusic', ['src/assets/GoodFellow.mp3']);
        this.load.audio('mixedtealpurpleMusic', ['src/assets/happyBirthday.mp3']);

    }
      
    create ()
    {
        this.add.sprite(windowWidth/2, windowHeight/2, 'sky');
        var emosity = this.add.sprite(windowWidth/2, windowHeight/2, 'logo');

        this.tweens.add({
            targets: emosity,
            alpha: { from: 0.1, to: 1},
            duration: 1500,
        });

        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('Intro');
            })
        }, this);

        this.input.on('pointerdown', () => {
            this.scene.start('Intro');
        }, this);
    }
}
