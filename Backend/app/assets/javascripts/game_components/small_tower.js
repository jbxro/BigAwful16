GameClient.SmallTower = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'tower');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  // Text

  this.zeroX = -1*(this.getLocalBounds().width * this.anchor.x);
  this.zeroY = -1*(this.getLocalBounds().height * this.anchor.y);
  // draw tower name
  this.text1 = this.addChild(this.game.add.text(this.zeroX + this.width*0.5, this.zeroY + this.height*0.35, data.name+" Tower"));
  this.text1.anchor.setTo(0.5);
  this.text1.fontSize = 25;
  // draw cable icon
  this.cable = this.addChild(this.game.make.sprite(this.zeroX + this.width/2, this.zeroY + this.height*0.55, 'cableIcons'));
  this.cable.anchor.setTo(0.5);
  // set cable color
  this.cable.frame = this.conflux.colors[data.towerCable];
  // draw cable description
  this.text2 = this.addChild(this.game.add.text(this.zeroX + this.width/2, this.zeroY + this.height*0.7, "Power cable"));
  this.text2.anchor.setTo(0.5);
  this.text2.fontSize = 20;

  // draw round buttons
  for(var i=0;i<data.roundButtons.length;i++){
    if (data.roundButtons[i] != 0) {
      var coords = conflux.dummyRoundButtonsCoordinates[i];
      var button = this.addChild(this.game.make.sprite(coords[0], coords[1], 'roundButtons'));
      button.frame = data.roundButtons[i];
    }
  }

  // draw square buttons
  for(var i=0;i<data.squareButtons.length;i++){
    if (data.squareButtons[i] != 0) {
      var coords = conflux.dummySquareButtonsCoordinates[i];
      var button = this.addChild(this.game.make.sprite(coords[0], coords[1], 'squareButtons'));
      button.frame = data.squareButtons[i];
    }
  }

  // draw switches
  for(var i=0;i<conflux.switchCoordinates.length;i++){
    var coords = conflux.switchCoordinates[i];
    // generate description
    if(i == 0){
      var desc = "Power Switch\nOn: " + data.towerSwitches.powerOn;
    } else if (i == 1){
      var desc = "Monitor Compatibility\nXVD: " + data.towerSwitches.monitorXVD;
    }
    var aSwitch = new GameClient.Element(conflux, game, coords[0], coords[1], game.world, 'switch', game.rnd.integerInRange(0, 1), desc);
    this.addChild(aSwitch);

  }

  for(var i=0;i<4;i++){
    var coords = conflux.portCoordinates[i];
    // generate description
    if(i == data.towerPort){
      var desc = "Display Port"
    } else {
      var desc = conflux.portDescriptions[this.game.rnd.integerInRange(0, conflux.portDescriptions.length-1)];
    }
    var port = new GameClient.Element(conflux, game, coords[0], coords[1], game.world, 'port', 0, desc);
    this.addChild(port);
  }

  // draw description pop up
  // this.addBubble = function(){
  //   if(!this.displayingHelp){
  //     var bubble = new GameClient.Bubble(this.game, this, "tower", data, "");
  //     this.displayingHelp = true;
  //   }
  // }
  // this.events.onInputDown.add(this.addBubble, this);
}
GameClient.SmallTower.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.SmallTower.prototype.constructor = GameClient.SmallTower;
