GameClient.DummyButton = function(conflux, game, x, y, group, key, color) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  if(color == 1) {
    this.frame = 0;
  } else {
    this.frame = 2;
  }
  group.add(this);
  this.conflux = conflux;
  this.inputEnabled = true;

  this.sfx = game.add.audio('button');
  this.sfx.volume = 0.4;

  this.action = function(){
    this.sfx.play();
    this.frame++;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function(){
      this.frame--;
    }, this);
    this.conflux.addFrustration(5);
  }
  this.events.onInputDown.add(this.action, this);
}
GameClient.DummyButton.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.DummyButton.prototype.constructor = GameClient.DummyButton;
