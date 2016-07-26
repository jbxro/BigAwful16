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

  this.zeroX = -1*(this.getLocalBounds().width * this.anchor.x);
  this.zeroY = -1*(this.getLocalBounds().height * this.anchor.y);

  if(type == "tower"){
    this.cable = this.addChild(this.game.make.sprite(this.zeroX + this.width/2, this.zeroY + this.height*0.55, 'cableIcons'));
    this.cable.anchor.setTo(0.5);
    this.text = this.addChild(this.game.add.text(this.zeroX + this.width/2, this.zeroY + this.height*0.7, "Power cable"));
    this.text.anchor.setTo(0.5);
    this.text.fontSize = 20;
  } else if(type == "monitor"){
    this.cable1 = this.addChild(this.game.make.sprite(this.zeroX + this.width*0.3, this.zeroY + this.height*0.55, 'cableIcons'));
    this.cable1.anchor.setTo(0.5);
    this.text1 = this.addChild(this.game.add.text(this.zeroX + this.width*0.3, this.zeroY + this.height*0.7, "Power cable"));
    this.text1.anchor.setTo(0.5);
    this.text1.fontSize = 20;
    this.cable2 = this.addChild(this.game.make.sprite(this.zeroX + this.width*0.7, this.zeroY + this.height*0.55, 'cableIcons'));
    this.cable2.anchor.setTo(0.5);
    this.text2 = this.addChild(this.game.add.text(this.zeroX + this.width*0.7, this.zeroY + this.height*0.7, "Data cable"));
    this.text2.anchor.setTo(0.5);
    this.text2.fontSize = 20;
  } else if(type == "control"){
    this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "TEST");
    this.text.fontSize = 30;
  }

  this.destroySelf = function(){
    this.parentSprite.displayingHelp = false;
    this.destroy();
  }
  this.events.onInputDown.add(this.destroySelf, this);

}
GameClient.Bubble.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Bubble.prototype.constructor = GameClient.Bubble;
