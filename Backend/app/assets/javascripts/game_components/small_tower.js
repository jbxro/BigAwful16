GameClient.SmallTower = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'tower');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new Bubble(this.game, this, "tower", "", "");
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);
}
GameClient.SmallTower.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.SmallTower.prototype.constructor = GameClient.SmallTower;
