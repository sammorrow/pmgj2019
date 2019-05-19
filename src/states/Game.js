/* globals __DEV__ */
import Phaser from 'phaser'
import { cooldownTic, lunge, activateLunge, victory } from '../utils/player';
import { FORWARD_VELOCITY, BACKWARD_VELOCITY, FIGHTER_CHUN_LI, FIGHTER_RYU } from '../constants/player';
import { MOVEMENT_UPTIME, MOVEMENT_DOWNTIME, DEAD_TIMEOUT, RESET_TIMER } from '../constants/world';
import { countdown, playHitSfx, resetGame } from '../utils/world';

export default class extends Phaser.State {
  init() { }

  preload() { }

  create() {
    // add bg layer
    this.bgLayer = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');

    // add sprites
    this.player1 = this.game.add.sprite(this.world.centerX - 300, this.world.centerY - 240, 'chunli');
    this.player2 = this.game.add.sprite(this.world.centerX + 300, this.world.centerY - 240, 'ryu');
    this.player1.params = { fighter: FIGHTER_CHUN_LI, movementCooldown: 0, negative: false, lungeFrame: 0, deadTimeout: 0, isDead: false };
    this.player2.params = { fighter: FIGHTER_RYU, movementCooldown: 0, negative: true, lungeFrame: 0, deadTimeout: 0, isDead: false };
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

    // set up GUI
    this.warningText = game.add.text(500, 100, '', {
      font: "32px Arial",
      fill: "#ff0044",
      align: "center"
    });
    this.warningText.anchor.setTo(0.5, 0.5)
    this.warningText.fixedToCamera = true;
  

    // animations
    this.player1.animations.add('walk');
    this.player2.animations.add('walk');
    
    this.player1.loadTexture('chunpunch');
    this.player1.animations.add('punch');
    this.player1.loadTexture('chunvictory');
    this.player1.animations.add('victory');
    this.player1.loadTexture('chunfall');
    this.player1.animations.add('fall');
    this.player1.loadTexture('chunidle');
    this.player1.animations.add('idle');

    this.player2.loadTexture('ryupunch');
    this.player2.animations.add('punch');
    this.player2.loadTexture('ryuvictory');
    this.player2.animations.add('victory');
    this.player2.loadTexture('ryufall');
    this.player2.animations.add('fall');
    this.player2.loadTexture('ryuidle');
    this.player2.animations.add('idle');


    this.music = Math.floor(Math.random() * 100) > 50 ? this.game.add.audio('loop1') : this.game.add.audio('loop3') 
    this.music.play()

    this.player1.animations.play('idle', 5, true);
    this.player2.animations.play('idle', 4, true);


    // sfx
    this.grunt1 = this.game.add.audio('grunt1');
    this.grunt2 = this.game.add.audio('grunt2');
    this.grunt3 = this.game.add.audio('grunt3');
    this.grunt4 = this.game.add.audio('grunt4');

    this.scream1 = this.game.add.audio('scream1');
    this.scream2 = this.game.add.audio('scream2');
    this.hpunch = this.game.add.audio('hpunch');
    this.mpunch = this.game.add.audio('mpunch');
    this.lpunch = this.game.add.audio('lpunch');
    this.victory = this.game.add.audio('victory');
    this.cheers = this.game.add.audio('crowd');



    // start movement cycle (players only move during uptime, though they can always lunge)
    this.movementTime = MOVEMENT_UPTIME;
    this.countdownFrame = 0;

    // when two weapons meet, there is a bounceback
    this.clashed = 0;

    // bool to represent win state
    this.gameOver = false;

    // setup camera
    game.camera.x = this.world.centerX - 450;
    game.camera.bounds.y = 400;

  }

  update(){
    const { player1, player2 } = this

    // body / world collisions
    if (!player1.params.deadTimeout) this.game.physics.arcade.collide(this.player1, this.collisionLayer);
    if (!player2.params.deadTimeout) this.game.physics.arcade.collide(this.player2, this.collisionLayer);
    this.game.physics.arcade.collide(this.player1, this.player2);
  }

  render() {
    const { player1, player2 } = this;

    if (this.countdownFrame <= 125) countdown(this);
    if (this.countdownFrame === 120){
      this.player1.loadTexture('chunli');
      this.player2.loadTexture('ryu');
      this.player1.animations.play('walk', 10, true);
      this.player2.animations.play('walk', 10, true);  
    }
    
    cooldownTic(player1, this);
    cooldownTic(player2, this);
    
    // player movement + controls
    if (!this.gameOver && this.countdownFrame > 105){
      if (!player1.params.deadTimeout){
        if (player1.params.isLunging) lunge(player1, this);
        else if (player1.params.canMove){
          if (this.eKey.isDown) activateLunge(player1, this);
          else if (this.movementTime < 0) player1.body.velocity.x = 0;
          else if (this.qKey.isDown) player1.body.velocity.x = BACKWARD_VELOCITY;
          else player1.body.velocity.x = FORWARD_VELOCITY;
        }
      } else {
        player1.angle -= 2;
      }

      if (!player2.params.deadTimeout){
        if (player2.params.isLunging) lunge(player2, this);
        else if (player2.params.canMove){
          if (this.iKey.isDown) activateLunge(player2, this);
          else if (this.movementTime < 0) player2.body.velocity.x = 0;
          else if (this.pKey.isDown) player2.body.velocity.x = -BACKWARD_VELOCITY;
          else player2.body.velocity.x = -FORWARD_VELOCITY;
        }
      } else {
        player2.angle -= 2;
      }

      if (this.movementTime > -MOVEMENT_DOWNTIME){
        this.movementTime = this.movementTime - 10;
      } else {
        this.movementTime = MOVEMENT_UPTIME;
      }
    }

    // weapon collisions
    game.physics.arcade.overlap(player1.params.weapon, player2.params.weapon, () => {
      this.clashed = 4
      player1.body.velocity.x -= 7000;
      player2.body.velocity.x += 7000;
    });
  
    // weapon hits
    if (!this.clashed && player1.params && player1.params.weapon){
      game.physics.arcade.overlap(player1.params.weapon, player2, () => {
        game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
        playHitSfx(this);
        this.player2.loadTexture('ryufall');
        this.player2.params.deadTimeout = DEAD_TIMEOUT;
        this.player2.params.isDead = true;
        this.player2.body.velocity.x = 1000;
        this.player2.animations.play('fall', 4, false, true);
        this.willScream = 20;
        if (player1.body.position.x > 2100) {
          this.gameOver = true
          this.warningText.setText("PLAYER 1 WINS !!", this)
          this.player2.params.deadTimeout = 60000;
          victory(this.player1, this)
          this.resetTimer = RESET_TIMER;
        }
        else if (player1.body.position.x > 1400) this.warningText.setText("WARNING : PLAYER 2", this)
        else this.warningText.setText("")
      });
    }
    if (!this.clashed && player2.params && player2.params.weapon){
      game.physics.arcade.overlap(player2.params.weapon, player1, () => {
        game.camera.follow(player2, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
        playHitSfx(this);
        this.player1.loadTexture('chunfall');
        this.player1.params.deadTimeout = DEAD_TIMEOUT;
        this.player1.params.isDead = true;
        this.player1.body.velocity.x = -1000;
        this.player1.animations.play('fall', 4, false, true);
        this.willScream = 20;
        if (game.camera.view.x === 0) {
          this.gameOver = true
          this.warningText.setText("PLAYER 2 WINS !!", this)
          this.player1.params.deadTimeout = 600000;
          victory(this.player2, this)
          this.resetTimer = RESET_TIMER;
        }
        else if (game.camera.view.x < 500) this.warningText.setText("WARNING : PLAYER 1", this)
        else this.warningText.setText("")
      });
    }
    if (this.willScream){
      this.willScream--;
      if (this.willScream === 0 && Math.floor(Math.random() * 100) > 90) this.scream1.play()
    }
    if (this.clashed) this.clashed--;
    if (this.resetTimer){
      this.resetTimer--;
      if (this.resetTimer === 0){
        this.button = this.game.add.image(200, 150, 'button')
        this.button.fixedToCamera = true;
        this.button.inputEnabled = true;
        this.button.events.onInputDown.add(resetGame(this), this);
      }
    }
  }
}
