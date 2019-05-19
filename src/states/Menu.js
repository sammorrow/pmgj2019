import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {

  }

  preload() {
    this.load.image('assets/images/menu/title.png');
    this.load.image('assets/images/menu/graphic.png');
    this.load.image('assets/images/menu/button.png');
  }

  create() {

  }
}

