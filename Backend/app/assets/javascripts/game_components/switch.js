GameClient.Switch = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'switch');
  group.add(this);
  this.state = false;
  this.inputEnabled = true;
  this.conflux = conflux

  this.toggle = function(){
    this.state =! this.state;
    if(!this.conflux.tower.pluggedIn){
      this.conflux.addFrustration(5)
    }
  }
  this.events.onInputDown.add(this.toggle, this);

  this.update = function(){
    this.frame = this.state ? 1 : 0;
  }
}
GameClient.Switch.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Switch.prototype.constructor = GameClient.Switch;