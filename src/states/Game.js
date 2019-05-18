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
    this.tilesprite = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');

    // add sprites
    this.player1 = this.game.add.sprite(this.world.centerX - 200, this.world.centerY, 'chunli');
    this.player2 = this.game.add.sprite(this.world.centerX + 200, this.world.centerY, 'ryu');
    this.player1.params = { fighter: FIGHTER_CHUN_LI, movementCooldown: 0, negative: false };
    this.player2.params = { fighter: FIGHTER_RYU, movementCooldown: 0, negative: true };

    this.game.physics.enable( [ this.player1, this.player2, this.tilesprite ], Phaser.Physics.ARCADE);
    this.tilesprite.body.collideWorldBounds = true;
    this.tilesprite.body.immovable = true;
    this.tilesprite.body.allowGravity = false;

    this.player1.body.collideWorldBounds = true;
    this.player2.body.collideWorldBounds = true;


    // console.log(this.game, this.player1, this.player2);
    this.game.camera.follow(this.player1)

    this.movementTime = MOVEMENT_UPTIME;
    // set up controls
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
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    this.player1.animations.play('walk', 10, true);
    this.player2.animations.play('walk', 10, true);


  }
  update() {
    const { player1, player2, tilesprite } = this;

  }

  render() {
    const { cursors, player1, player2, tilesprite } = this;

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

    game.physics.arcade.collide(player2, tilesprite);
    game.physics.arcade.collide(player1, player2, () => {
      player1.body.velocity.x = -2000;
      player2.body.velocity.x = 2000;
    });

    if (player1.params && player1.params.weapon){
      game.physics.arcade.collide(player1.params.weapon, player2, () => {
        console.log('hello', player1.params.weapon)
        player2.kill();
      });
    }

  }
}
