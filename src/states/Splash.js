import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    
    // load assets
    this.load.spritesheet('chunli', 'assets/images/chunli/walking-58x96x8.png', 58, 96, 8);
    this.load.spritesheet('ryu', 'assets/images/ryu/walking-56x96x5.png', 56, 96, 5);
    this.load.spritesheet('chunpunch', 'assets/images/chunli/forwardjump-68x102x8.png', 68, 102, 8);
    this.load.spritesheet('ryupunch', 'assets/images/ryu/jumphkick-56x96x3.png', 56, 96, 3);

    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('sword', 'assets/images/sword.png')
  }


  create () {
    this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');
    this.state.start('Game')
  }
}
