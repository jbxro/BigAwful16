GameClient.Switch = function(conflux, game, x, y, group, type) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'switch');
  group.add(this);
  // false - left
  // true - right
  this.state = false;
  this.inputEnabled = true;
  this.conflux = conflux

  this.sfx = game.add.audio('switch');
  this.sfx.volume = 0.7;

  this.toggle = function(){
    this.sfx.play();
    // flip the switch
    this.state =! this.state;
    // add frustration if flicking switches with unplugged tower
    if(!this.conflux.tower.pluggedIn){
      this.conflux.addFrustration(5)
    }
  }
  this.events.onInputDown.add(this.toggle, this);

  // set frame depending on state
  this.update = function(){
    this.frame = this.state ? 1 : 0;
  }
}
GameClient.Switch.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Switch.prototype.constructor = GameClient.Switch;
