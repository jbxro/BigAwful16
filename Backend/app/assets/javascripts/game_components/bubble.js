GameClient.Bubble = function(game, parent, type, data, description) {
  this.parentSprite = parent;
  Phaser.Sprite.call(this, game, 0, 0, 'bubble');
  this.game.world.add(this);
  this.inputEnabled = true;

  this.x = this.parentSprite.x + (0.5*this.parentSprite.width);
  this.y = this.parentSprite.y + (0.5*this.parentSprite.height);

  var left = this.x < 0.5*game.width;
  var top = this.y < 0.5*game.height;

  if (!left && top) {
    this.frame = 0;
    this.anchor.setTo(0.9, 0);
  } else if (left && top) {
    this.frame = 1;
    this.anchor.setTo(0.1, 0);
  } else if (!left && !top) {
    this.frame = 2;
    this.anchor.setTo(0.9, 1);
  } else {
    this.frame = 3;
    this.anchor.setTo(0.1, 1);
  }

  if(type == "device"){
    this.cable = this.addChild(this.game.make.sprite(-1*(this.getLocalBounds().width * this.anchor.x), -1*(this.getLocalBounds().height * this.anchor.y), 'cableIcons'));
  } else if(type == "control"){

  }

  this.destroySelf = function(){
    this.parentSprite.displayingHelp = false;
    this.destroy();
  }
  this.events.onInputDown.add(this.destroySelf, this);

}
GameClient.Bubble.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Bubble.prototype.constructor = GameClient.Bubble;
