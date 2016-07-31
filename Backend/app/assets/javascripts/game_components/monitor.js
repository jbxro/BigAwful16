GameClient.Monitor = function(conflux, game, x, y, group, buttons, correctInput) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'screen');
  // save starting position where screen is drawn
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
  this.justPlugged = false;
  this.connected = false;
  this.working = false;
  this.buttons = game.add.group();

  // Japanese "input" descriptions
  // there's an easter egg in them
  this.overlay = this.addChild(this.game.make.sprite(10, 10, 'signs'));
  this.overlay.visible = false;
  this.overlayActive = false;

  // annoying sound effect
  this.degaussSfx = game.add.audio('degauss');
  this.degaussSfx.volume = 0.6;

  // draw buttons on monitor based on button list from JSON spec
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

  // adds a button in specified location
  this.createButton = function(type, buttonX, buttonY) {
    var button = new GameClient.Button(this, game, buttonX, buttonY, this.buttons, this, type);
  }

  // power button functionality
  this.togglePower = function(){
    if(this.pluggedIn){
      this.powerOn =! this.powerOn;
      this.displayOverlay();
    } else {
      this.addFrustration();
    }
  }
  // input button functionality
  this.toggleInput = function(){
    if(this.powerOn){
      this.input++;
      if(this.input > 3) this.input = 0;
      this.displayOverlay();
    } else {
      this.addFrustration();
    }
  }
  // degauss button functionality
  this.degauss = function(){
    if(this.powerOn){
      this.degaussSfx.play();
      this.toggleShake();
      // stop after a second
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.toggleShake, this);
      this.addFrustration(5);
    } else {
      this.addFrustration();
    }
  }

  // turn on and off degauss effect
  this.toggleShake = function(){
    if(this.shaking){
      // return to original position
      this.x = this.originalX;
      this.y = this.originalY;
      this.shaking = false;
    } else {
      this.shaking = true;
    }
  }

  // display the input description for 3 seconds
  this.displayOverlay = function(){
    this.overlayActive = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){
      this.overlayActive = false;
    }, this);
  }

  // make the input description disappear instantly
  this.hideOverlay = function(){
    this.overlayActive = false;
  }

  // add more or less frustration depending on context
  this.addFrustration = function(moreFrustrating){
    if(moreFrustrating){
      this.conflux.addFrustration(10);
    } else {
      this.conflux.addFrustration(5);
    }
  }

  this.update = function(){
    // set input description
    this.overlay.frame = this.input;
    if(!this.pluggedIn) this.powerOn = false;
    if(this.powerOn){
      this.overlay.visible = this.overlayActive;
      // this is a win state for the entire game
      if((this.input == this.correctInput) && this.connected && conflux.tower.sendingData){
        this.frame = 2;
        // it's alive!
        this.working = true;
        if(!conflux.over){
          conflux.triggerWin();
        }
      } else {
        // set "NO SIGNAL"
        this.frame = 1;
      }
    } else {
      // monitor off
      this.overlay.visible = false;
      this.frame = 0;
    }
    if(this.shaking){
      // shake shake shake!
      this.x += this.game.rnd.integerInRange(-10, 10);
      this.y += this.game.rnd.integerInRange(-10, 10);
    }
  }
}
GameClient.Monitor.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Monitor.prototype.constructor = GameClient.Monitor;
