GameClient.SmallMonitor = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'monitor');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  for(var i=0;i<conflux.buttonCoordinates.length;i++){
    var coords = conflux.buttonCoordinates[i];
    switch (data.monitorButtons[i] ) {
      case 0:
        break;
      case 1:
        var desc = "Power Button";
        break;
      case 2:
        var desc = "Toggle Input";
        break;
      case 3:
        var desc = "Degauss";
        break;
      case 4:
        var desc = conflux.buttonDescriptions[this.game.rnd.integerInRange(0, conflux.buttonDescriptions.length-1)];
        break;
      default:
        console.log("Invalid button type");
    }

    if(data.monitorButtons[i] != 0){
      var button = new GameClient.Element(conflux, game, coords[0], coords[1], game.world, 'roundButtons', 4, desc);
      this.addChild(button);
    }
  }

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new GameClient.Bubble(this.game, this, "monitor", data, "");
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);

}
GameClient.SmallMonitor.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.SmallMonitor.prototype.constructor = GameClient.SmallMonitor;
