GameClient.Element = function(conflux, game, x, y, group, key, description){
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
};
GameClient.Element.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Element.prototype.constructor = GameClient.Element;
