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
  ctx.player1.animations.play("walk");
  ctx.countdownFrame++;
}
