
window.onload = function(){

  var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById("main"));

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

    this.game.load.image('background', 'assets/bg.png');
    this.game.load.image('port', 'assets/port.png');
    this.game.load.image('panel', 'assets/panel.png');
    this.game.load.image('socket', 'assets/socket.png');
    this.game.load.spritesheet('roundButtons', 'assets/buttons1.png', 32, 32);
    this.game.load.spritesheet('squareButtons', 'assets/buttons2.png', 31, 13);
    this.game.load.spritesheet('cableIcons', 'assets/cable_icons.png', 69, 105);
    this.game.load.spritesheet('cablesPluggedOutlet', 'assets/cables_plugged_outlet.png', 76, 466);
    this.game.load.spritesheet('cablesPluggedPort', 'assets/cables_plugged_port.png', 70, 419);
    this.game.load.spritesheet('cablesFloating', 'assets/cables.png', 100, 979);
    this.game.load.spritesheet('switch', 'assets/switch.png', 80, 68);

  },

  create: function() {

    this.background = this.game.add.sprite(0,0,'background');

    this.buttonList = [0,0,1,2,3,0,0,0];

    this.ports = this.game.add.group();
    for(var i=0;i<4;i++){
      var port = new Port(this, this.game, 1045, 324 - (i * 52), this.ports);
    }
    for(var i=0;i<2;i++){
      var socket = new Socket(this, this.game, 781, 424 - (i * 78), this.ports);
    }

    this.ports.forEach(function(item){
      item.inputEnabled = true;
      item.events.onInputDown.add(function(){
        if(item.pluggedCable.visible){
          var index = item.pluggedCable.frame;
          var proceed = true;
          for(var i=0;i<this.floatingCables.children.length;i++){
            if(this.floatingCables.children[i].active) proceed = false;
          }
          if(proceed){
            this.floatingCables.children[index].toggleDrag();
            item.pluggedCable.visible =! item.pluggedCable.visible;
          }
        } else {
          for(var i=0;i<this.floatingCables.children.length;i++){
            if(this.floatingCables.children[i].active){
              this.floatingCables.children[i].toggleDrag();
              item.pluggedCable.visible =! item.pluggedCable.visible;
              item.pluggedCable.frame = i;
            }
          }
        }
      }, this);
    }, this);

    this.panel = this.game.add.sprite(750, 550, 'panel');

    this.floatingCables = this.game.add.group();
    for(var i=0;i<5;i++){
      var cable = new Cable(this, this.game, 0, 0 + (i * 100), this.floatingCables, i);
    }

    this.cableIcons = this.game.add.group();
    for(var i=0;i<5;i++){
      this.cableIcons.create(40 + (i * 90), 580, 'cableIcons');
      this.cableIcons.children[i].frame = i;
      this.cableIcons.children[i].inputEnabled = true;
    }

    this.cableIcons.forEach(function(item){
      var index = this.cableIcons.children.indexOf(item);
      item.events.onInputDown.add(function(){
        var plugged;
        for (var i=0;i<this.ports.children.length;i++){
          if(this.ports.children[i].pluggedCable.visible && this.ports.children[i].pluggedCable.frame == index) plugged = true;
        }
        if(!plugged){
          var proceed = true;
          for (var i=0;i<this.floatingCables.children.length;i++){
            if(this.floatingCables.children[i].active){
              this.cableIcons.children[i].alpha = 1;
              this.floatingCables.children[i].toggleDrag();
              if(index == i){
                proceed = false;
              }
            }
          }
          if(proceed){
            this.cableIcons.children[index].alpha = 0.25;
            this.floatingCables.children[index].toggleDrag();
          }
        }
      }, this);
    }, this);


    //this.monitor = new Monitor(this, this.game, 0, 0, this.game.world, this.buttonList, 2);
    //this.monitor.generateLayout();


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

var Cable = function(conflux, game, x, y, group, color) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'cablesFloating');
  group.add(this);
  this.frame = color;
  this.visible = false;
  this.active = false;
  this.plugged = false;
  this.inputEnabled = true;
  this.input.enableDrag(false, true);
  this.anchor.x = 0.44;
  // ANCHOR 44, 0

  this.toggleDrag = function(){
    this.active = !this.active;
    this.visible = !this.visible;
  }

  this.update = function(){
    if(this.active){
      this.x = game.input.x;
      this.y = game.input.y+10;
    }
  }
}
Cable.prototype = Object.create(Phaser.Sprite.prototype);
Cable.prototype.constructor = Cable;

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

var Port = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'port');
  group.add(this);
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedPort');
  this.pluggedCable.visible = false;
}
Port.prototype = Object.create(Phaser.Sprite.prototype);
Port.prototype.constructor = Port;

var Socket = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'socket');
  group.add(this);
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedOutlet');
  this.pluggedCable.visible = false;
}
Socket.prototype = Object.create(Phaser.Sprite.prototype);
Socket.prototype.constructor = Socket;
