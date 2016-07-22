
window.onload = function(){

  var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById("main"));

  //game.state.add('Boot', GFG.Boot);
  //game.state.add('Preloader', GFG.Preloader)
  game.state.add('GameState', GFG.GameState);
  game.state.start('GameState');
}

var buttonCoordinates = [
  [225, 100],
  [225, 140],
  [225, 180],
  [720, 100],
  [720, 140],
  [720, 180],
  [265, 465],
  [305, 465],
  [345, 465],
  [670, 465],
  [630, 465],
  [590, 465]
]

var switchCoordinates = [
  [950, 370],
  [950, 465]
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
    this.game.load.spritesheet('signs', 'assets/signs.png', 160, 80);
    this.game.load.spritesheet('screen', 'assets/screen.png', 412, 336);

  },

  create: function() {

    this.buttonList = [0,0,1,0,0,0,2,0,0,0,4,3];

    this.game.camera.bounds = null;

    this.monitor = new Monitor(this, this.game, 279, 113, this.game.world, this.buttonList);
    this.monitor.generateLayout();

    this.background = this.game.add.sprite(0,0,'background');
    this.game.world.bringToTop(this.monitor.buttons);

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

    this.switches = this.game.add.group();
    for(var i=0;i<switchCoordinates.length;i++){
      var aSwitch = new Switch(this, this.game, switchCoordinates[i][0], switchCoordinates[i][1], this.switches);
    }

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
  },

  update: function() {},

  render: function() {
    this.game.debug.text("DEBUG", 32, 32);
    //this.game.camera.x = this.game.rnd.integerInRange(-10, 10);
    //this.game.camera.y = this.game.rnd.integerInRange(-10, 10);
  }
}

var Monitor = function(conflux, game, x, y, group, buttons, correctInput) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'screen');
  this.originalX = x;
  this.originalY = y;
  this.frame = 0;
  this.input = 0;
  this.correctInput = 3;
  group.add(this);
  this.powerOn = false;
  this.pluggedIn = true;
  this.receivingSignal = true;
  this.working = false;
  this.buttons = game.add.group();
  this.overlay = this.addChild(this.game.make.sprite(10, 10, 'signs'));
  this.overlay.visible = false;
  this.overlayActive = false;

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
    var button = new Button(this, game, buttonX, buttonY, this.buttons, this, type);
  }

  this.togglePower = function(){
    console.log("power!");
    if(this.pluggedIn){
      this.powerOn =! this.powerOn;
      this.displayOverlay();
    }
  }
  this.toggleInput = function(){
    if(this.powerOn){
      this.input++;
      if(this.input > 3) this.input = 0;
      this.displayOverlay();
      console.log("input " + String(this.input));
    }
  }
  this.degauss = function(){
    console.log("degauss!");
    this.toggleShake();
    this.game.time.events.add(Phaser.Timer.SECOND * 1, this.toggleShake, this);

  }

  this.toggleShake = function(){
    if(this.shaking){
      this.x = this.originalX;
      this.y = this.originalY;
      this.shaking = false;
    } else {
      this.shaking = true;
    }
  }

  this.displayOverlay = function(){
    this.overlayActive = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){
      this.overlayActive = false;
    }, this);
  }

  this.hideOverlay = function(){
    this.overlayActive = false;
  }

  this.update = function(){
    this.overlay.frame = this.input;
    if(this.powerOn){
      this.overlay.visible = this.overlayActive;
      if((this.input == this.correctInput) && this.receivingSignal){
        this.frame = 1;
        this.working = true;
      } else {
        this.frame = 0;
      }
    } else {
      this.overlay.visible = false;
      this.frame = 0;
    }
    if(this.shaking){
      this.x += this.game.rnd.integerInRange(-10, 10);
      this.y += this.game.rnd.integerInRange(-10, 10);
    }
  }
}
Monitor.prototype = Object.create(Phaser.Sprite.prototype);
Monitor.prototype.constructor = Monitor;


var Button = function(conflux, game, x, y, group, parent, type) {
  //BUTTON TYPES:
  // 1 - power
  // 2 - toggle input
  // 3 - degauss
  // 4 - nothing
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'roundButtons');
  this.frame = 4;
  group.add(this);
  this.type = type;
  this.inputEnabled = true;

  this.action = function(){
    this.frame++;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function(){
      this.frame--;
    }, this);
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
      case 4:
        break;
      default:
        console.log("Invalid button type.");
    }
  }
  this.events.onInputDown.add(this.action, this);
}
Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;


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


var Switch = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'switch');
  group.add(this);
  this.state = false;
  this.inputEnabled = true;

  this.toggle = function(){
    this.state =! this.state;
  }
  this.events.onInputDown.add(this.toggle, this);

  this.update = function(){
    this.frame = this.state ? 1 : 0;
  }
}
Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;
