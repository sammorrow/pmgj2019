/* globals __DEV__ */
import Phaser from 'phaser'
import lang from '../lang'
import { canMove, cooldownTic, lunge, activateLunge } from '../utils/player';
import { FORWARD_VELOCITY, BACKWARD_VELOCITY, FIGHTER_CHUN_LI, FIGHTER_RYU } from '../constants/player';
import { MOVEMENT_UPTIME, MOVEMENT_DOWNTIME } from '../constants/world';

export default class extends Phaser.State {
  init() { }

  preload() { }

  create() {
    // add bg layer
    this.bgLayer = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');

    // add sprites
    this.player1 = this.game.add.sprite(this.world.centerX - 300, this.world.centerY - 240, 'chunli');
    this.player2 = this.game.add.sprite(this.world.centerX + 300, this.world.centerY - 240, 'ryu');
    this.player1.params = { fighter: FIGHTER_CHUN_LI, movementCooldown: 0, negative: false };
    this.player2.params = { fighter: FIGHTER_RYU, movementCooldown: 0, negative: true };
    this.collisionLayer = this.game.add.sprite(0, 832, 'collision');

    // enable physics for all bodies
    this.game.physics.enable( [ this.player1, this.player2, this.collisionLayer ], Phaser.Physics.ARCADE);
    this.collisionLayer.body.collideWorldBounds = true;
    this.collisionLayer.body.immovable = true;
    this.collisionLayer.body.allowGravity = false;

    this.player1.body.allowGravity = true;
    this.player1.body.gravity.y = 200;
    this.player1.body.collideWorldBounds = true;

    this.player2.body.allowGravity = true;
    this.player2.body.gravity.y = 200;
    this.player2.body.collideWorldBounds = true;


    // setup camera
    this.game.camera.follow(this.player1)

    // set up controls : TODO - change from arrow keys to keyboard
    this.cursors = game.input.keyboard.createCursorKeys();

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    this.player1.animations.add('walk');
    this.player2.animations.add('walk');
    
    this.player1.loadTexture('chunpunch');
    this.player1.animations.add('punch');
    this.player1.loadTexture('chunli');

    this.player2.loadTexture('ryupunch');
    this.player2.animations.add('punch');
    this.player2.loadTexture('ryu');


    //  And this starts the animation playing by using its key ("walk")
    //  true means it will loop when it finishes
    this.player1.animations.play('walk', 10, true);
    this.player2.animations.play('walk', 10, true);

    // start movement cycle (players only move during uptime, though they can always lunge)
    this.movementTime = MOVEMENT_UPTIME;


  }

  update(){
    this.game.physics.arcade.collide(this.player1, this.collisionLayer);
    this.game.physics.arcade.collide(this.player2, this.collisionLayer);
  }

  render() {
    const { cursors, player1, player2, bgLayer, collisionLayer } = this;

    cooldownTic(player1);
    cooldownTic(player2);

    if (__DEV__) {
      this.game.debug.spriteInfo(player1, 32, 32)
    }
    
    // player controls
    if (player1.params.isLunging) lunge(player1);
    else if (player1.params.canMove){
      if (cursors.up.isDown) activateLunge(player1, this);
      else if (this.movementTime < 0) player1.body.velocity.x = 0;
      else if (cursors.left.isDown) player1.body.velocity.x = BACKWARD_VELOCITY;
      else player1.body.velocity.x = FORWARD_VELOCITY;
    }

    if (player2.params.isLunging) lunge(player2);
    else if (player2.params.canMove){
      if (cursors.down.isDown) activateLunge(player2, this);
      else if (this.movementTime < 0) player2.body.velocity.x = 0;
      else if (cursors.right.isDown) player2.body.velocity.x = -BACKWARD_VELOCITY;
      else player2.body.velocity.x = -FORWARD_VELOCITY;
    }
    if (this.movementTime > -MOVEMENT_DOWNTIME){
      this.movementTime = this.movementTime - 10;
    } else {
      this.movementTime = MOVEMENT_UPTIME;
    }


    // player body collisions  
    game.physics.arcade.collide(player2, bgLayer, () => {
      player2.body.velocity.y = -100;
    });
    game.physics.arcade.collide(player1, player2, () => {
      player1.body.velocity.x = -2000;
      player2.body.velocity.x = 2000;
    });

    // weapon collisions
    if (player1.params && player1.params.weapon){
      game.physics.arcade.collide(player1.params.weapon, player2, () => {
        player2.kill();
      });
    }
    if (player2.params && player2.params.weapon){
      game.physics.arcade.collide(player2.params.weapon, player1, () => {
        player1.kill();
      });
    }

  }
}
