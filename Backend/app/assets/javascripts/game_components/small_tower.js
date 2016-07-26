GameClient.SmallTower = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'tower');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  for(var i=0;i<data.roundButtons.length;i++){
    if (data.roundButtons[i] != 0) {
      var coords = conflux.dummyRoundButtonsCoordinates[i];
      var button = this.addChild(this.game.make.sprite(coords[0], coords[1], 'roundButtons'));
      button.frame = data.roundButtons[i];
    }
  }

  for(var i=0;i<data.squareButtons.length;i++){
    if (data.squareButtons[i] != 0) {
      var coords = conflux.dummySquareButtonsCoordinates[i];
      var button = this.addChild(this.game.make.sprite(coords[0], coords[1], 'squareButtons'));
      button.frame = data.squareButtons[i];
    }
  }

  for(var i=0;i<conflux.switchCoordinates.length;i++){
    var coords = conflux.switchCoordinates[i];
    var aSwitch = new GameClient.Element(conflux, game, coords[0], coords[1], game.world, 'switch', game.rnd.integerInRange(0, 1), "switch\nswitch\nswitch");
    this.addChild(aSwitch);
  }

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new GameClient.Bubble(this.game, this, "tower", "", "");
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);
}
GameClient.SmallTower.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.SmallTower.prototype.constructor = GameClient.SmallTower;
