GameClient.Socket = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'socket');
  group.add(this);
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedOutlet');
  this.pluggedCable.visible = false;
}
GameClient.Socket.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Socket.prototype.constructor = GameClient.Socket;
