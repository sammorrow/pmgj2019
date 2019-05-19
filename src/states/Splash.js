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
    this.load.spritesheet('chunidle', 'assets/images/chunli/idle-53x96x4.png', 53, 96, 4);
    this.load.spritesheet('ryuidle', 'assets/images/ryu/idle-53x96x4.png', 53, 96, 4);
    this.load.spritesheet('chunvictory', 'assets/images/chunli/victory-52x140x5.png', 52, 140, 5);
    this.load.spritesheet('ryuvictory', 'assets/images/ryu/victory-52x110x5.png', 52, 110, 5);
    this.load.spritesheet('chunfall', 'assets/images/chunli/defeat-80-96-4i.png', 80, 96, 4);
    this.load.spritesheet('ryufall', 'assets/images/ryu/defeat-75x96x4.png', 75, 96, 4);

    this.load.image('sword', 'assets/images/red-block.png');

    this.load.audio('loop1', 'assets/audio/loops/Purple Monkey Loop 1.mp3');
    this.load.audio('loop2', 'assets/audio/loops/Purple Monkey Loop 2 Slower Maybe Menu.mp3');
    this.load.audio('loop3', 'assets/audio/loops/Purple Monkey Loop 3.mp3');
    this.load.audio('loop4', 'assets/audio/loops/Purple Monkey Loop 4 Revised.mp3')

    this.load.audio('crowd', 'assets/audio/sfx/Purple Monkey Crowd.mp3');
    this.load.audio('grunt', 'assets/audio/sfx/Purple Monkey Grunt.mp3');

    this.load.audio('hpunch', 'assets/audio/sfx/Purple Monkey Punch High.mp3');
    this.load.audio('lpunch', 'assets/audio/sfx/Purple Monkey Punch Low.mp3');
    this.load.audio('mpunch', 'assets/audio/sfx/Purple Monkey Punch Med.mp3');

    this.load.audio('scream1', 'assets/audio/sfx/Purple Monkey Scream 1.mp3');
    this.load.audio('scream2', 'assets/audio/sfx/Purple Monkey Scream 2.mp3');
    this.load.audio('scream3', 'assets/audio/sfx/Purple Monkey Scream 3.mp3');
    this.load.audio('scream4', 'assets/audio/sfx/Purple Monkey Scream 4.mp3');
    this.load.audio('scream5', 'assets/audio/sfx/Purple Monkey Scream 4.mp3');

    this.load.audio('defeat', 'assets/audio/sfx/Purple Monkey Defeat.mp3');
    this.load.audio('victory', 'assets/audio/sfx/Purple Monkey Victory.mp3');

    this.load.audio('squarefx', 'assets/audio/sfx/Purple Monkey Square FX 1.mp3')
  }


  create () {
    this.game.add.tileSprite(0, 0, this.world.bounds.width, this.world.bounds.height, 'background');
    this.state.start('Game');

    let music = this.game.add.audio('loop1');
    // music.play()
  }
}
