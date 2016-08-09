GameClient.Bubble = function(game, parent, type, data, description) {
  this.parentSprite = parent;
  this.game = game;
  Phaser.Sprite.call(this, game, 0, 0, 'bubble');
  this.game.world.add(this);
  this.inputEnabled = true;

  // draw popup in middle of parent sprite
  this.x = this.parentSprite.world.x + (0.5*this.parentSprite.width);
  this.y = this.parentSprite.world.y + (0.5*this.parentSprite.height);

  // get absolute coordinates of popup
  var left = this.parentSprite.world.x < 0.5*game.width;
  var top = this.parentSprite.world.y < 0.5*game.height;

  // set bubble orientation based on position on screen
  // set anchor to the pointy bit
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

  // set reference coordinates for popup content
  this.zeroX = -1*(this.getLocalBounds().width * this.anchor.x);
  this.zeroY = -1*(this.getLocalBounds().height * this.anchor.y);

  // drawing the pop up contents
  if(type == "monitor"){
    // draw monitor name
    this.text0 = this.addChild(this.game.add.text(this.zeroX + this.width*0.5, this.zeroY + this.height*0.35, data.name+" Monitor"));
    this.text0.anchor.setTo(0.5);
    this.text0.fontSize = 25;
    // draw power cable and label
    this.cable1 = this.addChild(this.game.make.sprite(this.zeroX + this.width*0.3, this.zeroY + this.height*0.55, 'cableIcons'));
    this.cable1.anchor.setTo(0.5);
    this.cable1.frame = this.parentSprite.conflux.colors[data.monitorCables.power];
    this.text1 = this.addChild(this.game.add.text(this.zeroX + this.width*0.3, this.zeroY + this.height*0.7, "Power cable"));
    this.text1.anchor.setTo(0.5);
    this.text1.fontSize = 20;
    // draw data cable and label
    this.cable2 = this.addChild(this.game.make.sprite(this.zeroX + this.width*0.7, this.zeroY + this.height*0.55, 'cableIcons'));
    this.cable2.anchor.setTo(0.5);
    this.cable2.frame = this.parentSprite.conflux.colors[data.monitorCables.data];
    this.text2 = this.addChild(this.game.add.text(this.zeroX + this.width*0.7, this.zeroY + this.height*0.7, "Data cable"));
    this.text2.anchor.setTo(0.5);
    this.text2.fontSize = 20;
  } else if(type == "control"){
    // draw provided description
    this.text = this.addChild(this.game.add.text(this.zeroX + this.width*0.5, this.zeroY + this.height*0.5, description));
    this.text.anchor.setTo(0.5);
    this.text.fontSize = 25;
  }

  // remove the pop up on click
  this.destroySelf = function(){
    this.parentSprite.displayingHelp = false;
    this.destroy();
  }
  this.events.onInputDown.add(this.destroySelf, this);

}
GameClient.Bubble.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Bubble.prototype.constructor = GameClient.Bubble;
