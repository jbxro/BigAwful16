
window.onload = function(){

  var game = new Phaser.Game(1024, 600, Phaser.CANVAS, document.getElementById("main"));

  //game.state.add('Boot', GFG.Boot);
  //game.state.add('Preloader', GFG.Preloader)
  game.state.add('GameState', GFG.GameState);
  game.state.start('GameState');
}

var buttonCoordinates = [
  [20, 20],
  [455, 20],
  [20, 355],
  [70, 355],
  [120, 355],
  [350, 355],
  [400, 355],
  [450, 355],
]

var GFG = {};

GFG.GameState = function(game){};

GFG.GameState.prototype = {
  // Settings
  // State variables


  preload: function() {

    this.game.load.image('monitor', 'monitor.png');
    this.game.load.image('button', 'button.png');
    this.game.load.image('cable', 'cable.png');
    this.game.load.image('port', 'port.png');

  },

  create: function() {

    this.buttonList = [0,0,0,0,0,0,0];
    for (var i = 1; i < 4; i++) {
      var a = true;
      while(a){
        var index = this.game.rnd.integerInRange(0, 7);
        if (this.buttonList[index] == 0){
          this.buttonList[index] = i;
          a = false;
        }
      }
    }


    this.monitor = new Monitor(this, this.game, 0, 0, this.game.world, this.buttonList, 2);
    this.monitor.generateLayout();

    var cables = this.game.add.group();
    for (var i = 0; i < 3; i++)
    {
        var tempSprite = cables.create(this.game.world.randomX, this.game.world.randomY, 'cable');
        tempSprite.inputEnabled = true;
        tempSprite.input.enableDrag(false, true);
    }

    //cable.events.onDragStop.add(checkConnection, this);

  },

  update: function() {

  },

  render: function() {
    this.game.debug.text("DEBUG", 32, 32);
  }

}

var Monitor = function(conflux, game, x, y, group, buttons, inputs) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'monitor');
  group.add(this);

  this.powerOn = false;
  this.numberOfInputs = inputs;
  this.buttons = game.add.group();

  this.generateLayout = function() {
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i] != 0){
        var coords = buttonCoordinates[i];
        xCoord = coords[0];
        yCoord = coords[1];
        this.createButton(buttons[i], xCoord, yCoord);
      }
    }
  }

  this.createButton = function(type, buttonX, buttonY) {
    var button = new Button(this, game, x+buttonX, y+buttonY, this.buttons, this, type);
  }

  this.togglePower = function(){}
  this.toggleInput = function(){}
  this.degauss = function(){}
}
Monitor.prototype = Object.create(Phaser.Sprite.prototype);
Monitor.prototype.constructor = Monitor;

var Button = function(conflux, game, x, y, group, parent, type) {
  //BUTTON TYPES:
  // 1 - power
  // 2 - toggle input
  // 3 - degauss
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'button');
  group.add(this);
  this.type = type;
  this.inputEnabled = true;
  //this.events.onInputDown.add(this.action, this);

  this.action = function(){
    switch (this.type) {
      case 1:
        parent.togglePower();
        break;
      case 2:
        parent.toggleInput();
        break;
      case 3:
        parent.degauss();
        break;
      default:
        console.log("Invalid button type.");
    }
  }
}
Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

var Screen = function(conflux, game, x, y, group, state) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'screen');
  group.add(this);
}
Screen.prototype = Object.create(Phaser.Sprite.prototype);
Screen.prototype.constructor = Screen;
