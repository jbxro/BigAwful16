function startPhaserApp(gameType, id, data){

  var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById("main"));
  game.state.add('GrandpaGame', GFG.GrandpaGame);
  game.state.add('GrandsonGame', GFG.GrandsonGame);
  switch (gameType) {
    case 'grandpa':
      game.state.start('GrandpaGame', false, true, data);
      break;
    case 'grandson':
      game.state.start('GrandsonGame', false, true, data);
      break;
    default:
      console.log('invalid game type')
      return 1;
  }
}

var data = {
/*
  Make sure that grandpa's computer and tower don't share cable colors!
*/
"grandpasHardware": {"monitor": 2,"tower": 1}, // randomized 0 - 2

"monitors":[ // array of possible monitors
  {
    "name": "SCL-50EX", // (semi)randomly generated
    "type": "XVD", // XVD or SGA (replace with something funny later)
    "logo": 2, // just in case
    "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
    /*
    12 possible button slots, fill up 4:
    0 - empty
    1 - power
    2 - input
    3 - degauss
    4 - nothing
    */
    "monitorCables": {"power": "blue", "data": "red"},
    /*
    Possible colors:
    blue, green, yellow, red, purple
    */
    "monitorInput": 2 // number of active input. randomized in range 0 - 3
  },

  {
    "name": "SCL-50EX",
    "logo": 2,
    "type": "SGA",
    "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
    "monitorCables": {"power": "blue", "data": "red"},
    "monitorInput": 2
  },

  {
    "name": "SCL-50EX",
    "logo": 2,
    "type": "SGA",
    "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
    "monitorCables": {"power": "blue", "data": "red"},
    "monitorInput": 2
  }
],

"towers": [ // array of possible towers
  {
    "name": "Grinder XT",
    "logo": 3,
    "towerPort": 2, // correct port to connect monitor - randomize 0 - 3
    "towerCable": "green",
    "roundButtons": [1,0], // randomize 0 - 2
    "squareButtons": [2,2], // randomize 0 - 2
    "towerSwitches": {"powerOn": "left", "monitorXVD": "right"} // randomize left or right
  },

  {
    "name": "Grinder XT",
    "logo": 3,
    "towerPort": 2,
    "towerCable": "green",
    "roundButtons": [0,2],
    "squareButtons": [1,2],
    "towerSwitches": {"powerOn": "left", "monitorXVD": "right"}
  },

  {
    "name": "Grinder XT",
    "logo": 3,
    "towerPort": 2,
    "towerCable": "green",
    "roundButtons": [1,2],
    "squareButtons": [1,2],
    "towerSwitches": {"powerOn": "left", "monitorXVD": "right"}
  }

]

};

var GFG = {};

GFG.GrandsonGame = function(game){};

GFG.GrandsonGame.prototype = {
  // Settings
  // State variables
  colors: {
    "blue": 0,
    "yellow": 1,
    "green": 2,
    "red": 3,
    "purple": 4
  },

  switchState: {
    "left": false,
    "right": true
  },

  switchCoordinates: [
    [35, 160],
    [35, 210]
  ],

  buttonCoordinates: [
    [6, 20],
    [6, 40],
    [6, 60],
    [252, 20],
    [252, 40],
    [252, 60],
    [25, 204],
    [50, 204],
    [75, 204],
    [185, 204],
    [205, 204],
    [230, 204]
  ],

  dummyRoundButtonsCoordinates: [
    [19, 133],
    [42, 133]
  ],

  dummySquareButtonsCoordinates: [
    [12, 12],
    [32, 12]
  ],

  portCoordinates: [
    [83, 55],
    [83, 81],
    [83, 107],
    [83, 133],
  ],

  monitorCoordinates: [
    [95, 106],
    [462, 106],
    [830, 106]
  ],

  towerCoordinates: [
    [165, 407],
    [533, 407],
    [900, 407]
  ],

  portDescriptions: [
    "Coaxial Port",
    "WiFi Port",
    "Laser Communication Port",
    "Cellular Network Bus",
    "IBS Port",
    "GBS Port",
    "PDA Port",
    "YOSPOS Interface Connector",
    "NOTIM Port (ED variety)",
    "NOTIM Port (ANT variety)",
    "Over/Under Port",
    "VR Port",
    "Washing machine interface"
  ],

  init: function(inputData) {
    this.data = inputData;
  },

  preload: function(){

    this.game.load.image('background', 'assets/grandson/bg.png');
    this.game.load.image('port', 'assets/grandson/port.png');
    this.game.load.image('monitor', 'assets/grandson/monitor.png');
    this.game.load.image('tower', 'assets/grandson/tower.png');
    this.game.load.spritesheet('roundButtons', 'assets/grandson/roundButtons.png', 16, 16);
    this.game.load.spritesheet('squareButtons', 'assets/grandson/squareButtons.png', 16, 6);
    this.game.load.spritesheet('cableIcons', 'assets/grandson/cable_icons.png', 35, 53);
    this.game.load.spritesheet('switch', 'assets/grandson/switch.png', 40, 35);
    this.game.load.spritesheet('bubble', 'assets/grandson/bubble.png', 343, 289);

  },

  create: function(){

    this.background = this.game.add.sprite(0, 0, 'background');

    this.monitors = this.game.add.group();
    for(var i=0;i<this.data.monitors.length;i++){
      var coords = this.monitorCoordinates[i];
      var monitor = new SmallMonitor(this, this.game, coords[0], coords[1], this.monitors, this.data.monitors[i]);
    }
    this.towers = this.game.add.group();
    for(var i=0;i<this.data.monitors.length;i++){
      var coords = this.towerCoordinates[i];
      var monitor = new SmallTower(this, this.game, coords[0], coords[1], this.towers, this.data.towers[i]);
    }

  },

  update: function(){

  },

  render: function(){

  }

}

GFG.GrandpaGame = function(game){};

GFG.GrandpaGame.prototype = {
  // Settings
  // State variables
  switchCoordinates: [
    [950, 370],
    [950, 465]
  ],

  buttonCoordinates: [
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
  ],

  dummyRoundButtonsCoordinates: [
    [920, 325],
    [965, 325]
  ],

  dummySquareButtonsCoordinates: [
    [905, 85],
    [945, 85]
  ],

  colors: {
    "blue": 0,
    "yellow": 1,
    "green": 2,
    "red": 3,
    "purple": 4
  },

  switchState: {
    "left": false,
    "right": true
  },

  init: function(inputData) {
    this.data = inputData;
   },

  preload: function() {

    this.game.load.image('background', 'assets/grandpa/bg.png');
    this.game.load.image('port', 'assets/grandpa/port.png');
    this.game.load.image('panel', 'assets/grandpa/panel.png');
    this.game.load.image('socket', 'assets/grandpa/socket.png');
    this.game.load.image('frustrationBar', 'assets/grandpa/barInside.png');
    this.game.load.spritesheet('roundButtons', 'assets/grandpa/buttons1.png', 32, 32);
    this.game.load.spritesheet('squareButtons', 'assets/grandpa/buttons2.png', 31, 13);
    this.game.load.spritesheet('cableIcons', 'assets/grandpa/cable_icons.png', 69, 105);
    this.game.load.spritesheet('cablesPluggedOutlet', 'assets/grandpa/cables_plugged_outlet.png', 76, 466);
    this.game.load.spritesheet('cablesPluggedPort', 'assets/grandpa/cables_plugged_port.png', 70, 419);
    this.game.load.spritesheet('cablesFloating', 'assets/grandpa/cables.png', 100, 979);
    this.game.load.spritesheet('switch', 'assets/grandpa/switch.png', 80, 68);
    this.game.load.spritesheet('signs', 'assets/grandpa/signs.png', 160, 80);
    this.game.load.spritesheet('screen', 'assets/grandpa/screen.png', 412, 336);
    this.game.load.spritesheet('frustrationBarWrapper', 'assets/grandpa/barWrapper.png', 476, 78);

  },

  create: function() {

    this.grandpasMonitor = this.data.monitors[this.data.grandpasHardware.monitor];
    this.grandpasTower = this.data.towers[data.grandpasHardware.tower];

    this.game.camera.bounds = null;

    this.frustration = 0;
    this.frustrationRate = 1;
    this.game.time.events.loop(5 * Phaser.Timer.SECOND, this.addFrustration, this);

    this.monitor = new Monitor(this, this.game, 279, 113, this.game.world, this.grandpasMonitor.monitorButtons, this.grandpasMonitor.monitorInput);
    this.monitor.generateLayout();

    this.tower = new Tower(this, this.game, this.grandpasTower);

    this.background = this.game.add.sprite(0,0,'background');
    this.game.world.bringToTop(this.monitor.buttons);

    this.dummyButtons = this.game.add.group();
    for(var i=0;i<this.grandpasTower.roundButtons.length;i++){
      if(this.grandpasTower.roundButtons[i] != 0) {
        var butt = new DummyButton(this, this.game, this.dummyRoundButtonsCoordinates[i][0], this.dummyRoundButtonsCoordinates[i][1], this.dummyButtons, 'roundButtons', this.grandpasTower.roundButtons[i]);
      }
    }
    for(var i=0;i<this.grandpasTower.squareButtons.length;i++){
      if(this.grandpasTower.squareButtons[i] != 0) {
        var butt = new DummyButton(this, this.game, this.dummySquareButtonsCoordinates[i][0], this.dummySquareButtonsCoordinates[i][1], this.dummyButtons, 'squareButtons', this.grandpasTower.squareButtons[i]);
      }
    }

    this.ports = this.game.add.group();
    this.sockets = this.game.add.group();
    for(var i=0;i<4;i++){
      var port = new Port(this, this.game, 1045, 324 - (i * 52), this.ports);
    }
    for(var i=0;i<2;i++){
      var socket = new Socket(this, this.game, 781, 424 - (i * 78), this.sockets);
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

    this.sockets.forEach(function(item){
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
    for(var i=0;i<this.switchCoordinates.length;i++){
      var aSwitch = new Switch(this, this.game, this.switchCoordinates[i][0], this.switchCoordinates[i][1], this.switches);
    }

    this.panel = this.game.add.sprite(750, 550, 'panel');

    this.barInside = this.game.add.sprite(655, 635, 'frustrationBar');
    this.barInsideWidth = this.barInside.width;
    this.barCropRect = new Phaser.Rectangle(0,0,0,this.barInside.height);
    this.barInside.crop(this.barCropRect);
    this.barWrapper = this.game.add.sprite(650, 600, 'frustrationBarWrapper');

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
        for (var i=0;i<this.sockets.children.length;i++){
          if(this.sockets.children[i].pluggedCable.visible && this.sockets.children[i].pluggedCable.frame == index) plugged = true;
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

  update: function() {
    this.barInside.updateCrop();
    this.monitor.pluggedIn = false;
    this.sockets.forEach(function(item){
      if(item.pluggedCable.visible && (item.pluggedCable.frame == this.colors[this.grandpasMonitor.monitorCables.power])){
        this.monitor.pluggedIn = true;
      }
    }, this);

    this.monitor.connected = false;
    this.ports.forEach(function(item){
      var index = this.ports.children.indexOf(item);
      if(item.pluggedCable.visible && (item.pluggedCable.frame == this.colors[this.grandpasMonitor.monitorCables.data]) && (index == this.grandpasTower.towerPort)){
        this.monitor.connected = true;
      }
    }, this);

    this.tower.pluggedIn = false;
    this.tower.powerOn = false;
    this.tower.sendingData = false;
    this.sockets.forEach(function(item){
      if(item.pluggedCable.visible && (item.pluggedCable.frame == this.colors[this.grandpasTower.towerCable])){
        this.tower.pluggedIn = true;
      }
    }, this);

    if(this.tower.pluggedIn){
      this.tower.powerOn = (this.switches.children[0].state == this.tower.powerOnSetting) ? true : false;
    }

    if(this.tower.powerOn){
      this.tower.sendingData = (this.switches.children[1].state == this.tower.monitorSetting) ? true : false;
    }
  },

  render: function() {
    if(this.frustration >= 50){
      this.game.camera.x = this.game.rnd.integerInRange(-1*((this.frustration-50)/5), (this.frustration-50)/10);
      this.game.camera.y = this.game.rnd.integerInRange(-1*((this.frustration-50)/5), (this.frustration-50)/10);
    }
  },

  addFrustration: function(amount) {
    this.updateFrustrationRate();
    if (typeof amount === 'undefined'){
      amount = this.frustrationRate;
    }
    if (this.frustration <= 100) {
      this.frustration += amount;
      if (this.frustration > 100){
        this.frustration = 100;
      }
      if (this.frustration < 0){
        this.frustration = 0;
      }
    }
    var tween = this.game.add.tween(this.barCropRect).to( { width: (this.frustration/100)*this.barInsideWidth }, 100, "Linear", true);
    tween.start();
    this.frustration >= 80 ? this.barWrapper.frame=1 : this.barWrapper.frame=0;
  },

  updateFrustrationRate: function() {
    var r = 0;
    this.monitor.pluggedIn ? r-- : r++;
    this.monitor.powerOn ? r-- : r++;
    this.monitor.connected ? r-- : r++;
    this.tower.pluggedIn ? r-- : r++;
    this.tower.powerOn ? r-- : r++;
    (this.monitor.input == this.monitor.correctInput) ? r-- : r++;
    this.frustrationRate = r;
  }
}

var Monitor = function(conflux, game, x, y, group, buttons, correctInput) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'screen');
  this.originalX = x;
  this.originalY = y;
  this.buttonList = buttons;
  this.conflux = conflux;
  this.frame = 0;
  this.input = 0;
  this.correctInput = correctInput;
  group.add(this);
  this.powerOn = false;
  this.pluggedIn = false;
  this.connected = false;
  this.working = false;
  this.buttons = game.add.group();
  this.overlay = this.addChild(this.game.make.sprite(10, 10, 'signs'));
  this.overlay.visible = false;
  this.overlayActive = false;

  this.generateLayout = function() {
    for (var i = 0; i < this.buttonList.length; i++) {
      if (this.buttonList[i] != 0){
        var coords = conflux.buttonCoordinates[i];
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
    if(this.pluggedIn){
      console.log("power!");
      this.powerOn =! this.powerOn;
      this.displayOverlay();
    } else {
      this.addFrustration();
    }
  }
  this.toggleInput = function(){
    if(this.powerOn){
      this.input++;
      if(this.input > 3) this.input = 0;
      this.displayOverlay();
      console.log("input " + String(this.input));
    } else {
      this.addFrustration();
    }
  }
  this.degauss = function(){
    if(this.powerOn){
      console.log("degauss!");
      this.toggleShake();
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.toggleShake, this);
      this.addFrustration(true);
    } else {
      this.addFrustration();
    }
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

  this.addFrustration = function(moreFrustrating){
    if(moreFrustrating){
      this.conflux.addFrustration(10);
    } else {
      this.conflux.addFrustration(5);
    }
  }

  this.update = function(){
    this.overlay.frame = this.input;
    if(!this.pluggedIn) this.powerOn = false;
    if(this.powerOn){
      this.overlay.visible = this.overlayActive;
      if((this.input == this.correctInput) && this.connected && conflux.tower.sendingData){
        this.frame = 2;
        this.working = true;
      } else {
        this.frame = 1;
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

var Tower = function(conflux, game, grandpasTower) {
  this.powerOn = false;
  this.sendingData = false;
  this.pluggedIn = false;
  if(grandpasTower.towerSwitches.powerOn == "left") {
    this.powerOnSetting = false;
  } else {
    this.powerOnSetting = true;
  }
  if(grandpasTower.towerSwitches.monitorXVD == "left") {
    this.monitorSetting = false;
  } else {
    this.monitorSetting = true;
  }
}


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
  this.conflux = conflux;

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
        this.conflux.addFrustration(5);
        break;
      default:
        console.log("Invalid button type.");
    }
  }
  this.events.onInputDown.add(this.action, this);
}
Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

var DummyButton = function(conflux, game, x, y, group, key, color) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  if(color == 1) {
    this.frame = 0;
  } else {
    this.frame = 2;
  }
  group.add(this);
  this.conflux = conflux;
  this.inputEnabled = true;

  this.action = function(){
    this.frame++;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function(){
      this.frame--;
    }, this);
    this.conflux.addFrustration(5);
  }
  this.events.onInputDown.add(this.action, this);
}
DummyButton.prototype = Object.create(Phaser.Sprite.prototype);
DummyButton.prototype.constructor = DummyButton;

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
  this.conflux = conflux

  this.toggle = function(){
    this.state =! this.state;
    if(!this.conflux.tower.pluggedIn){
      this.conflux.addFrustration(5)
    }
  }
  this.events.onInputDown.add(this.toggle, this);

  this.update = function(){
    this.frame = this.state ? 1 : 0;
  }
}
Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;

var Bubble = function(game, parentSprite, type, data, description) {
  this.parentSprite = parentSprite;
  Phaser.Sprite.call(this, game, 0, 0, 'bubble');
  this.game.world.add(this);
  this.inputEnabled = true;

  if(type == "control"){
    this.x = 0.5*this.parentSprite.width;
    this.y = 0.5*this.parentSprite.height;
    this.parentSprite.addChild(this);
  } else {
    this.x = this.parentSprite.x + (0.5*this.parentSprite.width);
    this.y = this.parentSprite.y + (0.5*this.parentSprite.height);
  }

  console.log(this.world.x);
  console.log(this.world.y);

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
    this.text = this.addChild(this.game.add.text(this.zeroX+this.width/2, this.zeroY+this.height/2, description));
    this.text.anchor.setTo(0.5);
    this.text.fontSize = 30;
  }

  this.destroySelf = function(){
    this.parentSprite.displayingHelp = false;
    this.destroy();
  }
  this.events.onInputDown.add(this.destroySelf, this);

}
Bubble.prototype = Object.create(Phaser.Sprite.prototype);
Bubble.prototype.constructor = Bubble;

var SmallMonitor = function(conflux, game, x, y, group, data) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'monitor');
  group.add(this);
  this.inputEnabled = true;
  this.displayingHelp = false;
  this.game = game;
  this.conflux = conflux;

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new Bubble(this.game, this, "monitor", "", "");
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);
}
SmallMonitor.prototype = Object.create(Phaser.Sprite.prototype);
SmallMonitor.prototype.constructor = SmallMonitor;

var SmallTower = function(conflux, game, x, y, group, data) {
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
    var aSwitch = new Element(conflux, game, coords[0], coords[1], game.world, 'switch', game.rnd.integerInRange(0, 1), "switch");
    this.addChild(aSwitch);
  }

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new Bubble(this.game, this, "tower", "", "");
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);
}
SmallTower.prototype = Object.create(Phaser.Sprite.prototype);
SmallTower.prototype.constructor = SmallTower;

var Element = function(conflux, game, x, y, group, key, frame, description) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  group.add(this);
  this.description = description;
  this.frame = frame;
  this.inputEnabled = true;
  this.displayingHelp = false;

  this.addBubble = function(){
    if(!this.displayingHelp){
      var bubble = new Bubble(this.game, this, "control", "", this.description);
      this.displayingHelp = true;
    }
  }
  this.events.onInputDown.add(this.addBubble, this);

}
Element.prototype = Object.create(Phaser.Sprite.prototype);
Element.prototype.constructor = Element;
