GameClient.SmallMonitor = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'monitor');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  // draw tower name
  this.titleText = this.addChild(this.game.add.text(this.width/2, -40, data.name));
  this.titleText.anchor.setTo(0.5);
  this.titleText.fontSize = 25;
  this.titleText.wordWrap = true;
  this.titleText.wordWrapWidth = 300;
  // draw power cable icon
  this.cable = this.addChild(this.game.make.sprite(30, this.height+25, 'cableIcons'));
  this.cable.anchor.setTo(0);
  // set cable color
  this.cable.frame = this.conflux.colors[data.towerCable];
  // draw cable description
  this.cableText = this.addChild(this.game.add.text(this.width/2, this.height+50, "<- Power Cable"));
  this.cableText.anchor.setTo(0.5);
  this.cableText.fontSize = 14;
  
  var currentMarker = 0;
  // generate the monitor button layout
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
        // pick random description from list
        var desc = conflux.buttonDescriptions[this.game.rnd.integerInRange(0, conflux.buttonDescriptions.length-1)];
        break;
      default:
        console.log("Invalid button type");
    }
    // draw the button
    if(data.monitorButtons[i] != 0){
      var button = new GameClient.Element(conflux, game, coords[0], coords[1], game.world, 'roundButtons', 4, desc);
      this.addChild(button);
      
      var hOffset = coords[0]+button.width+5;
      var vOffset = coords[1]-5;
      if(coords[0] < 10){
        hOffset = coords[0]-30;
      }
      if(coords[1] > 200){
        hOffset = coords[0]+button.width/2-13;
        vOffset = coords[1]+button.height+5;
      }
      var marker = this.addChild(this.game.make.sprite(hOffset, vOffset, 'marker'))
      marker.frame = currentMarker;

      var textMarker = this.addChild(this.game.make.sprite(this.width/2-80, this.height+80+(40*currentMarker), 'marker'))
      textMarker.frame = currentMarker;
      var text = this.addChild(this.game.add.text(this.width/2-50, this.height+83+(40*currentMarker), desc));
      text.fontSize = 16;
      currentMarker += 1;
    }
  }
}
GameClient.SmallMonitor.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.SmallMonitor.prototype.constructor = GameClient.SmallMonitor;
