GameClient.Port = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'port');
  group.add(this);
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedPort');
  this.pluggedCable.visible = false;
}
GameClient.Port.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Port.prototype.constructor = GameClient.Port;


