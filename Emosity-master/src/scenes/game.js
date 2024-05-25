import Phaser from 'phaser'
import Player from './player.js'
import Enemy from './enemies.js'

var windowWidth = 480;
var windowHeight = 270;
var gameWidth = 65*32;
var gameHeight = 40*32;

var inventoryIcon;
var inventoryFlag = false;
var gridWidth = 300;
var gridHeight = 200;
var gridCellWidth = 75;
var gridCellHeight = 100;
var currentCol = 0;
var currentGrid = 0;
var topLeft = [];
var bottomLeft = [];
var buttons;

var player;
var playerX = 200;
var playerY = gameHeight-120;

var map;
var platforms;
var walls;
var decor;
var records;
var recordGroup;
var collected; 
var respawnButton;

var enemies;
var enemyGroup;

var cloudsSmall;
var cloudsMedium;
var cloudsLarge;


export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload ()
    {
        // this.sound.unlock();
        // this.load.audio('black', ['src/assets/LateAtNight.mp3']);
        // this.load.audio('red', ['src/assets/ElevatorMusic.mp3']);
        // this.load.audio('yellow', ['src/assets/ForestWalk.mp3']);
        // this.load.audio('blue', ['src/assets/marimbamagic.mp3']);
        // this.load.audio('mixedblueteal', ['src/assets/LateAtNight.mp3']);
        // this.load.audio('mixedbluepink', ['src/assets/MelodyOfNature.mp3']);
        // this.load.audio('broken', ['src/assets/Clown.mp3']);
        // this.load.audio('orange', ['src/assets/GoodFellow.mp3']);
        // this.load.audio('green', ['src/assets/GoodFellow.mp3']);
        // this.load.audio('mixedtealpurple', ['src/assets/happyBirthday.mp3']);
    }
      
    create ()
    {
        //World bounds
        this.physics.world.setBounds(0, 0, gameWidth, gameHeight, true, false, false, true);  // left/right/top/bottom

        //Sky & clouds
        this.add.tileSprite(0, gameHeight, gameWidth, gameHeight,'sky').setOrigin(0, 1);
        cloudsSmall = this.add.tileSprite(0, gameHeight, gameWidth, gameHeight, "cloudsSmall").setOrigin(0, 1);
        cloudsMedium = this.add.tileSprite(0, gameHeight, gameWidth, gameHeight, "cloudsMedium").setOrigin(0, 1);
        cloudsLarge = this.add.tileSprite(0, gameHeight, gameWidth, gameHeight, "cloudsLarge").setOrigin(0, 1);
        
        //Tiled map
        map = this.make.tilemap({key: 'map'}); //JSON import name
        
        let grasstileset = map.addTilesetImage('grasstileset', 'grasstiles'); //Tiled tileset name, png import name
        platforms = map.createLayer('platforms', grasstileset); //Tiled layer name
        platforms.setCollisionByExclusion([-1]); 

        map.forEachTile(function(tile, index, tileArray) { 
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        }, this);
        
        let wallImage = map.addTilesetImage('walls', 'walls');
        walls = map.createLayer('walls', wallImage);
        walls.setCollisionByExclusion([-1]);
        walls.visible = false;

        recordGroup = this.physics.add.staticGroup(); 
        records = map.createFromObjects('records', { key: 'records' }); 
        records.forEach(object => {
            if(object.getData('vinyl') == 'black')
            {
                object.setTexture('records', 0);
            }
            else if(object.getData('vinyl') == 'red')
            {
                object.setTexture('records', 1);
            }
            else if(object.getData('vinyl') == 'yellow')
            {
                object.setTexture('records', 2);
            }
            else if(object.getData('vinyl') == 'blue')
            {
                object.setTexture('records', 3);
            }
            else if(object.getData('vinyl') == 'mixedblueteal')
            {
                object.setTexture('records', 4);
            }
            else if(object.getData('vinyl') == 'mixedbluepink')
            {
                object.setTexture('records', 5);
            }
            else if(object.getData('vinyl') == 'mixedtealpurple')
            {
                object.setTexture('records', 6);
            }
            else if(object.getData('vinyl') == 'green')
            {
                object.setTexture('records', 7);
            }
            else if(object.getData('vinyl') == 'orange')
            {
                object.setTexture('records', 8);
            }
            else if(object.getData('vinyl') == 'broken')
            {
                object.setTexture('records', 9);
            }

            recordGroup.add(object);
        })

        decor = map.createFromObjects('decor', { key: 'decor' });
        decor.forEach(object => {
            if(object.getData('grass'))
            {
                if(object.getData('grass') == 'tall')
                {
                    object.setTexture('decor', 0);
                }
                else if(object.getData('grass') == 'short')
                {
                    object.setTexture('decor', 1);
                }
            }

            else if(object.getData('flower'))
            {
                if(object.getData('flower') == 'blue')
                {
                    object.setTexture('decor', 2);
                }
                else if(object.getData('flower') == 'pink')
                {
                    object.setTexture('decor', 3);
                }
                else if(object.getData('flower') == 'yellow')
                {
                    object.setTexture('decor', 4);
                }
            }
        })

        map.createFromObjects('house', { key: 'house' });

        //Enemies instantiation using Enemy extended class
        enemyGroup = this.physics.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.collideWorldBounds = true;
        enemies = map.getObjectLayer('enemies');
        enemies.objects.forEach(object => {
            let enemy = this.physics.add.existing(new Enemy(this, object.x, object.y, 'enemies'));
            this.physics.add.collider(enemy, platforms);
            this.physics.add.collider(enemy, walls);
            enemyGroup.add(enemy);
            enemy.setVelocityX(50);
        })

        //Player instantiation using Player extended class
        player = this.physics.add.existing(new Player(this, playerX, playerY, 'player'));
        player.setBodySize(player.width*0.5, player.height*0.9);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        // player.body.checkCollision.up = false;
        // player.body.checkCollision.left = false;
        // player.body.checkCollision.right = false;
        this.physics.add.collider(player, platforms);  

        this.physics.add.overlap(player, recordGroup, this.collectRecord, null, this);
        this.physics.add.overlap(player, enemyGroup, this.playerDeath, null, this);

        //Camera instantiation
        this.cameras.main.setBounds(0, 0, gameWidth, gameHeight);
        this.cameras.main.startFollow(player);

        //Inventory 
        inventoryIcon = this.add.sprite(windowWidth-25, 40, 'inventoryIcon').setInteractive().setScrollFactor(0, 0);
        collected = this.physics.add.staticGroup();
        collected.scaleXY(2);

        buttons = this.add.group();

        var inventory = this.add.grid(windowWidth/2, windowHeight/2, gridWidth, gridHeight, gridCellWidth, gridCellHeight, 0x4B4B4B)
                                .setAltFillStyle(0x656565)
                                .setActive(false)
                                .setVisible(false)
                                .setScrollFactor(0, 0);
        
        //Inventory top/bottom left coords to set record position later
        inventory.getTopLeft(topLeft);
        inventory.getBottomLeft(bottomLeft);

        inventoryIcon.on('pointerdown', function () {
            if(inventoryFlag == false)
            {
                inventory.setActive(true).setVisible(true);
                collected.setActive(true).setVisible(true);
                buttons.setActive(true).setVisible(true);
                inventoryFlag = true;
            }
            else
            {
                inventory.setActive(false).setVisible(false);
                collected.setActive(false).setVisible(false);
                buttons.setActive(true).setVisible(false);
                inventoryFlag = false;
            }
        }, this);
        
    }

    update ()
    {
        //Cloud animation
        cloudsSmall.tilePositionX += 0.15;
        cloudsMedium.tilePositionX += 0.1;
        cloudsLarge.tilePositionX += 0.05;
        
    }

    collectRecord(player, record) 
    {
        const musicParticles = this.add.particles(record.x, record.y, 'musicNotes', {
            frame: { frames: [ 'red', 'orange', 'yellow', 'green', 'blue', 'purple' ], cycle: true },
            x: 0,
            y: 0,
            speed: { min: 0, max: 25 },
            scale: { min: 0.5, max: 1.25 },
            gravityY: -25,
            angle: { min: 0, max: -180 },
            lifespan: 1500,
            maxParticles: 30
        });

        //Add record to collected group, remove from record group
        collected.add(record);
        recordGroup.remove(record);
        
        //Record disabled until inventory is enabled
        record.setActive(false).setVisible(false).setScrollFactor(0, 0).setScale(2).setDepth(1);
    
        //Record sounds
        var vinylMusic;

        //Add play button for the record
        var button = this.add.sprite(0, 0, 'buttons', 1).setActive(false).setVisible(false).setInteractive().setScrollFactor(0, 0);
        //Add buttons to button group, set data for vinyl and playing state
        buttons.add(button);
        button.setDataEnabled();
        button.setData('vinyl', record.getData('vinyl'));
        button.setData('playing', false);

        //Button press logic
        button.on('pointerdown', function () {
            if(button.getData('playing') == false)
            {
                this.sound.stopAll();
                buttons.children.each(function(button) {
                    button.setTexture('buttons', 1);
                });
                button.setTexture('buttons', 0);
                button.setData('playing', true);
                if(button.getData('vinyl') == 'black')
                {
                    vinylMusic = this.sound.add('blackMusic', { loop: true });
                    vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'red')
                {
                    vinylMusic = this.sound.add('redMusic', { loop: true });
                    vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'yellow')
                {
                    vinylMusic = this.sound.add('yellowMusic', { loop: true });
                    vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'blue')
                {
                   vinylMusic = this.sound.add('blueMusic', { loop: true });
                   vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'mixedblueteal')
                {
                   vinylMusic = this.sound.add('mixedbluetealMusic', { loop: true });
                   vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'mixedbluepink')
                {
                   vinylMusic = this.sound.add('mixedbluepinkMusic', { loop: true });
                   vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'broken')
                {
                   vinylMusic = this.sound.add('brokenMusic', { loop: true });
                   vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'orange')
                {
                   vinylMusic = this.sound.add('orangeMusic', { loop: true });
                   vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'green')
                {
                   vinylMusic = this.sound.add('greenMusic', { loop: true });
                   vinylMusic.play();
                }
                else if(button.getData('vinyl') == 'mixedtealpurple')
                {
                   vinylMusic = this.sound.add('mixedtealpurpleMusic', { loop: true });
                   vinylMusic.play();
                }
            }
            else if(button.getData('playing') == true)
            {
                button.setTexture('buttons', 1);
                button.setData('playing', false);
                this.sound.stopAll();
            }
        }, this);

        //reset currentCol when reaching new row
        if(currentGrid == 4)
        {
            currentCol = 0;
        }

        if(currentGrid <= 3)
        {
            record.setPosition(topLeft['x']+(gridCellWidth/2)+(gridCellWidth*currentCol), topLeft['y']+(gridCellHeight/3), 1); // z = depth of 1 
            button.setPosition(topLeft['x']+(gridCellWidth/2)+(gridCellWidth*currentCol), topLeft['y']+(gridCellHeight*2/3), 1);
        }
        else
        {
            record.setPosition(bottomLeft['x']+(gridCellWidth/2)+(gridCellWidth*currentCol), bottomLeft['y']-(gridCellHeight*2/3), 1);
            button.setPosition(bottomLeft['x']+(gridCellWidth/2)+(gridCellWidth*currentCol), bottomLeft['y']-(gridCellHeight/3), 1);
        }

        currentCol++;
        currentGrid++;

        if(currentGrid == 8) //All records collected
        {
            this.time.addEvent({
                delay: 1500,
                callback: ()=> {
                    this.scene.switch('Outro');
                }
            })
        }
    }

    playerDeath(player, enemy)
    {
        const deathParticles = this.add.particles(player.x, player.y, 'deathParticles', {
            frame: { frames: [ 'skull', 'black' ], cycle: true },
            x: 0,
            y: 0,
            speed: { min: 0, max: 25 },
            scale: { min: 0.75, max: 1.25 },
            gravityY: -25,
            angle: { min: 0, max: -180 },
            lifespan: 2500,
            maxParticles: 30
        });

        this.cameras.main.stopFollow();
        player.setVisible(false).setActive(false);
        player.body.setVelocity(0);
        player.setPosition(playerX, playerY);

        this.time.addEvent({
            delay: 1500,
            callback: ()=> {
                respawnButton = this.add.sprite(windowWidth/2, windowHeight/2, 'respawnButton').setScale(2).setInteractive().setScrollFactor(0, 0);

                respawnButton.on('pointerdown', function () {
                    respawnButton.destroy();
                    player.setVisible(true).setActive(true);
                    this.cameras.main.startFollow(player);
                }, this);
            }
        })
    }

}


