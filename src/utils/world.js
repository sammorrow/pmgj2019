export const countdown = ctx => {
  if (ctx.countdownFrame === 40){
    ctx.roundText = ctx.game.add.text(ctx.game.world.centerX - 50, ctx.game.world.centerY - 500, "READY?", {
      font: "65px Arial",
      fill: "#ff0044",
      align: "center"
    });
  } else if (ctx.countdownFrame === 90 && ctx.roundText){
    ctx.roundText.setText("    GO!");
  } else if (ctx.countdownFrame === 125 && ctx.roundText){
    ctx.roundText.setText("");
  }
  ctx.countdownFrame++;
}


export const displayWarningText = (text, ctx) => {
  if (!text){
    ctx.warningText.setText("");
  } else {
    ctx.warningText.setText(`text`);
  }
}


export const playHitSfx = ctx => {
  if (Math.floor(Math.random() * 100) > 20) ctx.hpunch.play();
  else if (Math.floor(Math.random() * 100) > 20) ctx.mpunch.play();
  else ctx.lpunch.play()
}

export const resetGame = ctx => () => {
  ctx.music.stop()
  ctx.cheers.stop()
  ctx.state.start('Game');
}