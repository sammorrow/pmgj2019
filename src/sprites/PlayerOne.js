import Phaser from 'phaser';
import PlayerTwo from './PlayerTwo';
import Ground from './Ground';

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);

  }

  update () {
    this.angle += 1;
    this.game.physics.arcade.collide(PlayerOne, Ground, () => {
      PlayerTwo.body.velociy = -10;
    });
  }
}