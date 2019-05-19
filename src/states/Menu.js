import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {

  }

  preload() {
    this.load.image('title', 'assets/images/menu/title.png');
    this.load.image('graphic', 'assets/images/menu/graphic.png');
    this.load.image('button', 'assets/images/menu/button.png');
    
  }

  create() {
    this.game.add.audio('loop2').play();
  }
}

