GameClient.SmallMonitor = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'monitor');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new GameClient.Bubble(this.game, this, "monitor", "", "");
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);

}
GameClient.SmallMonitor.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.SmallMonitor.prototype.constructor = GameClient.SmallMonitor;
