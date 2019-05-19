import { FORWARD_VELOCITY, LUNGE_INITIAL_VELOCITY, LUNGE_TIMEFRAME, LUNGE_DECELERATION, COOLDOWN_TIC, MOVEMENT_COOLDOWN, FIGHTER_CHUN_LI } from '../constants/player';

// unused right now
export const resetSpriteMomentum = sprite => {
  sprite.body.velocity.x = FORWARD_VELOCITY;
}


// called during every frame
export const cooldownTic = (sprite, ctx) => {
  if (sprite.params.movementCooldown > 0) sprite.params.movementCooldown = sprite.params.movementCooldown - COOLDOWN_TIC;
  else sprite.params.canMove = true;

  if (sprite.params.lungeTimeframe > 0) sprite.params.lungeTimeframe = sprite.params.lungeTimeframe - COOLDOWN_TIC;
  else {
    if (sprite.animations.currentAnim.name === "punch"){
      if (sprite.params.fighter === FIGHTER_CHUN_LI){
        sprite.loadTexture('chunli');
        sprite.animations.play('walk');  
      } else {
        sprite.loadTexture('ryu');
        sprite.animations.play('walk');  
      }
    }
    sprite.params.isLunging = false;
    sprite.params.lungeFrame = 0;
    sprite.params.weapon = null;
  }

  if (sprite.params.deadTimeout > 0) sprite.params.deadTimeout = sprite.params.deadTimeout - COOLDOWN_TIC;
  else if (sprite.params.isDead){
    sprite.params.deadTimeout = 0;
    sprite.angle = 0;
    sprite.params.isDead = false;
    if (sprite.params.negative) {
      sprite.loadTexture('ryu');
      sprite.animations.play('walk');  
      sprite.reset(ctx.player1.body.x + 1000, ctx.player1.body.y);
    } else {
      sprite.loadTexture('chunli');
      sprite.animations.play('walk');  
      sprite.reset(ctx.player2.body.x - 1200, ctx.player2.body.y);
    }
  }
}

// called when a player presses the lunge button
export const activateLunge = (sprite, ctx) => {
  sprite.params.lungeTimeframe = LUNGE_TIMEFRAME;
  sprite.params.isLunging = true;

  sprite.params.movementCooldown = MOVEMENT_COOLDOWN;
  sprite.params.canMove = true;

  if (sprite.params.negative) sprite.params.lungeVelocity = -LUNGE_INITIAL_VELOCITY;
  else sprite.params.lungeVelocity = LUNGE_INITIAL_VELOCITY;
  
  if (sprite.params.fighter === FIGHTER_CHUN_LI){
    sprite.loadTexture('chunpunch');
    sprite.animations.play('punch', 10);
  } else {
    sprite.loadTexture('ryupunch');
    sprite.animations.play('punch', 10);
  }
  if (Math.floor(Math.random() * 100) > 40) {
    let gruntNum = Math.floor(Math.random() * 100);
    if (gruntNum > 90) ctx.grunt4.play()
    else if (gruntNum > 70) ctx.grunt3.play()
    else if (gruntNum > 50) ctx.grunt2.play()
    else ctx.grunt1.play()
  }
}

// called during each frame of a lunge
export const lunge = (sprite, ctx) => {
  const updatedVelocity = sprite.params.lungeVelocity / LUNGE_DECELERATION;
  

  // create hitbox
  if (sprite.params.lungeFrame === 5){
    let newSprite;
    if (sprite.params.negative){
      newSprite = new Phaser.Sprite(ctx.game, 0, 0, 'sword', 'red-block.png')
      newSprite.scale.setTo(0.75, 0.7);
      newSprite.anchor.setTo(0.5, -0.75);
      newSprite.scale.x *= -1;
    } else {
      newSprite = new Phaser.Sprite(ctx.game, 64, 0, 'sword', 'red-block.png');
      newSprite.scale.setTo(0.75, 0.7);
      newSprite.anchor.setTo(0.4, -0.75);
    }
    newSprite.alpha = 0;
    sprite.addChild(newSprite);
    ctx.game.physics.enable(newSprite, Phaser.Physics.ARCADE);
    sprite.params.weapon = newSprite;
  }

  // remove hitbox
  if (sprite.params.lungeFrame === 8){
    sprite.children.forEach(child => child.kill());
  }

  sprite.body.velocity.x = updatedVelocity
  sprite.params.lungeVelocity = updatedVelocity;
  sprite.params.lungeFrame++;
}

export const victory = (sprite, ctx) => {
  sprite.body.velocity.x = 0;
  sprite.body.gravity.y = -100;
  sprite.body.collideWorldBounds = false;

  ctx.music.stop();
  ctx.victory.play();
  ctx.cheers.loopFull();
  ctx.cheers.play();
  
  if (sprite.params.negative){
    sprite.loadTexture('ryuvictory');
    sprite.animations.play('victory', 5, true);
  } else {
    sprite.loadTexture('chunvictory');
    sprite.animations.play('victory', 10, true);
    sprite.body.offset.setTo(0, -30)
  }

}