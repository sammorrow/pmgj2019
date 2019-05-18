import Phaser from 'phaser';
import PlayerOne from 'PlayerOne';
import PlayerTwo from 'PlayerTwo';

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
  }

  update () {
    this.angle += 1;

  }
}