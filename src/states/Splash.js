import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    
    // preload assets
    this.load.spritesheet('chunli', 'assets/images/chunli/walking-58x96x8.png', 58, 96, 8);
    this.load.spritesheet('ryu', 'assets/images/ryu/walking-56x96x5.png', 56, 96, 5);
    this.load.spritesheet('chunpunch', 'assets/images/chunli/hpunch-90-96-3.png', 90, 96, 3);
    this.load.spritesheet('ryupunch', 'assets/images/ryu/jumphkick-56x96x3.png', 56, 96, 3);

    this.load.image('sword', 'assets/images/sword.png');

    this.load.audio('loop1', 'assets/audio/loops/Purple Monkey Loop 1.wav');
    this.load.audio('loop2', 'assets/audio/loops/Purple Monkey Loop 2 Slower Maybe Menu.wav');
    this.load.audio('loop3', 'assets/audio/loops/Purple Monkey Loop 3.wav');
    this.load.audio('loop4', 'assets/audio/loops/Purple Monkey Loop 4.wav')

  }


  create () {
    this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');
    this.state.start('Game');

    let music = this.add.audio('loop1');
    music.play()
  }
}
