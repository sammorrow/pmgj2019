/* globals __DEV__ */
import Phaser from 'phaser'
import lang from '../lang'
import { canMove, cooldownTic, lunge, activateLunge } from '../utils/player';
import { FORWARD_VELOCITY, BACKWARD_VELOCITY, FIGHTER_CHUN_LI, FIGHTER_RYU } from '../constants/player';
import { MOVEMENT_UPTIME, MOVEMENT_DOWNTIME } from '../constants/world';
import { countdown } from '../utils/world';

export default class extends Phaser.State {
  init() { }

  preload() { }

  create() {
    // add bg layer
    this.bgLayer = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');

    // add sprites
    this.player1 = this.game.add.sprite(this.world.centerX - 300, this.world.centerY - 240, 'chunli');
    this.player2 = this.game.add.sprite(this.world.centerX + 300, this.world.centerY - 240, 'ryu');
    this.player1.params = { fighter: FIGHTER_CHUN_LI, movementCooldown: 0, negative: false, lungeFrame: 0 };
    this.player2.params = { fighter: FIGHTER_RYU, movementCooldown: 0, negative: true, lungeFrame: 0 };
    this.collisionLayer = this.game.add.sprite(0, 848, 'collision');
    this.collisionLayer.alpha = 0;

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


    // set up controls
    this.qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.iKey = game.input.keyboard.addKey(Phaser.Keyboard.I);
    this.pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);


    // animations
    this.player1.animations.add('walk');
    this.player2.animations.add('walk');
    
    this.player1.loadTexture('chunpunch');
    this.player1.animations.add('punch');
    this.player1.loadTexture('chunidle');
    this.player1.animations.add('idle');

    this.player2.loadTexture('ryupunch');
    this.player2.animations.add('punch');
    this.player2.loadTexture('ryuidle');
    this.player2.animations.add('idle');


    this.player1.animations.play('idle', 2, true);
    this.player2.animations.play('idle', 3, true);

    // start movement cycle (players only move during uptime, though they can always lunge)
    this.movementTime = MOVEMENT_UPTIME;
    this.countdownFrame = 0;

    // setup camera
    game.camera.x = this.world.centerX - 450;
    game.camera.bounds.y = 300;

  }

  update(){
    // body / world collisions
    this.game.physics.arcade.collide(this.player1, this.collisionLayer);
    this.game.physics.arcade.collide(this.player2, this.collisionLayer);
    this.game.physics.arcade.collide(this.player1, this.player2);
  }

  render() {
    const { player1, player2, bgLayer } = this;

    if (this.countdownFrame <= 125) countdown(this);
    if (this.countdownFrame === 124){
      this.player1.loadTexture('chunli');
      this.player2.loadTexture('ryu');
      this.player1.animations.play('walk', 10, true);
      this.player2.animations.play('walk', 10, true);  
    }
    
    cooldownTic(player1);
    cooldownTic(player2);

    if (__DEV__) {
      this.game.debug.spriteInfo(player2, 32, 32)
    }
    
    // player movement + controls
    if (this.countdownFrame > 105){
      if (player1.params.isLunging) lunge(player1, this);
      else if (player1.params.canMove){
        if (this.eKey.isDown) activateLunge(player1, this);
        else if (this.movementTime < 0) player1.body.velocity.x = 0;
        else if (this.qKey.isDown) player1.body.velocity.x = BACKWARD_VELOCITY;
        else player1.body.velocity.x = FORWARD_VELOCITY;
      }

      if (player2.params.isLunging) lunge(player2, this);
      else if (player2.params.canMove){
        if (this.iKey.isDown) activateLunge(player2, this);
        else if (this.movementTime < 0) player2.body.velocity.x = 0;
        else if (this.pKey.isDown) player2.body.velocity.x = -BACKWARD_VELOCITY;
        else player2.body.velocity.x = -FORWARD_VELOCITY;
      }
      if (this.movementTime > -MOVEMENT_DOWNTIME){
        this.movementTime = this.movementTime - 10;
      } else {
        this.movementTime = MOVEMENT_UPTIME;
      }
    }

    // weapon collisions
    if (player2.params && player2.params.weapon && player1.params && player1.params.weapon){
      game.physics.arcade.collide(player1.params.weapon, player2.params.weapon, () => {
        console.log("Hit!")
        player1.body.velocity.x -= 7000;
        player2.body.velocity.x += 7000;
      });
    }
    // weapon hits
    else if (player1.params && player1.params.weapon){
      game.physics.arcade.collide(player1.params.weapon, player2, () => {
        player2.kill();
        game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
        player2.reset(player1.body.x + 1000, player1.body.y);

      });
    }
    else if (player2.params && player2.params.weapon){
      game.physics.arcade.collide(player2.params.weapon, player1, () => {
        player1.kill();
        game.camera.follow(player2, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5)
        player1.reset(player2.body.x - 1100, player2.body.y);
      });
    }


  }
}
