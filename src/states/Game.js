/* globals __DEV__ */
import Phaser from 'phaser'
import lang from '../lang'
import { resetSpriteMomentum } from '../utils/player';

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    // set up GUI
    const bannerText = lang.text('welcome')
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    // add sprites
	  this.mushroom = this.game.add.sprite(this.world.centerX, this.world.centerY, 'mushroom');
    this.game.physics.arcade.enable(this.mushroom);

    // set up controls
    this.cursors = game.input.keyboard.createCursorKeys();
  }

  render() {
    const { cursors } = this;

    resetSpriteMomentum(this.mushroom);

    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
    
    // player controls
    if (cursors.left.isDown) this.mushroom.body.velocity.x = -400;
    else if (cursors.right.isDown) this.mushroom.body.velocity.x = 400;
    
    if (cursors.up.isDown) this.mushroom.body.velocity.y = -400;
    else if (cursors.down.isDown) this.mushroom.body.velocity.y = 400;

  }
}
