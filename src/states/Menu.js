import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {

  }

  preload() {
    this.load.image('title', 'assets/images/menu/title.png');
    this.load.image('graphic', 'assets/images/menu/graphic.png');
    this.load.image('button', 'assets/images/menu/button.png');
    this.load.image('tile', 'assets/images/menu/tilesprite.png')
    this.music = this.game.add.audio('loop2');
  }

  create() {
    this.music.play();
    this.background = this.game.add.tileSprite(50, 0, 800, 600, 'tile')
    this.game.add.image(150, 50, 'title');
    this.game.add.image(300, 125, 'graphic').scale.setTo(.15, .15);
    this.button = this.game.add.image(325, 385, 'button');
    this.button.scale.setTo(.3, .3);
    this.button.inputEnabled = true;
    this.button.events.onInputDown.add(onClick, this);

    function onClick() {
      this.state.start('Game');
      this.music.stop();
    }

  } 

    update() {
      this.background.tilePosition.y -= 4;
    }
  }

