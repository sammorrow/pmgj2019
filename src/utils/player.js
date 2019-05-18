import { FORWARD_VELOCITY, LUNGE_INITIAL_VELOCITY, LUNGE_TIMEFRAME, LUNGE_DECELERATION, COOLDOWN_TIC, MOVEMENT_COOLDOWN, FIGHTER_CHUN_LI } from '../constants/player';

export const resetSpriteMomentum = sprite => {
  sprite.body.velocity.x = FORWARD_VELOCITY;
}

export const cooldownTic = sprite => {
  if (sprite.params.movementCooldown > 0) sprite.params.movementCooldown = sprite.params.movementCooldown - COOLDOWN_TIC;
  else sprite.params.canMove = true;

  if (sprite.params.lungeTimeframe > 0) sprite.params.lungeTimeframe = sprite.params.lungeTimeframe - COOLDOWN_TIC;
  else {
    if (sprite.animations.currentAnim.name !== "walk"){
      if (sprite.params.fighter === FIGHTER_CHUN_LI){
        sprite.loadTexture('chunli');
        sprite.animations.play('walk');  
      } else {
        console.log(sprite);
        sprite.loadTexture('ryu');
        sprite.animations.play('walk');  
      }
    }

    sprite.params.isLunging = false;
    sprite.children.forEach(child => child.kill());
    sprite.params.weapon = null;
  }
}

export const activateLunge = (sprite, ctx) => {
  sprite.params.lungeTimeframe = LUNGE_TIMEFRAME;
  sprite.params.isLunging = true;

  sprite.params.movementCooldown = MOVEMENT_COOLDOWN;
  sprite.params.canMove = true;

  if (sprite.params.negative) sprite.params.lungeVelocity = -LUNGE_INITIAL_VELOCITY;
  else sprite.params.lungeVelocity = LUNGE_INITIAL_VELOCITY;
  
  if (sprite.params.fighter === FIGHTER_CHUN_LI){
    sprite.loadTexture('chunpunch');
    sprite.animations.play('punch');  
  } else {
    sprite.loadTexture('ryupunch');
    sprite.animations.play('punch');  
  }

  let newSprite;
  if (sprite.params.negative){
    newSprite = new Phaser.Sprite(ctx.game, 0, 0, 'sword', 'sword.png')
    newSprite.scale.x *= -1;
  } else newSprite = new Phaser.Sprite(ctx.game, 64, 0, 'sword', 'sword.png');

  newSprite.anchor.setTo(.5, 0);
  sprite.addChild(newSprite);
  ctx.game.physics.enable( newSprite, Phaser.Physics.ARCADE);
  sprite.params.weapon = newSprite;
}

export const lunge = sprite => {
  const updatedVelocity = sprite.params.lungeVelocity / LUNGE_DECELERATION;

  sprite.body.velocity.x = updatedVelocity
  sprite.params.lungeVelocity = updatedVelocity;
}