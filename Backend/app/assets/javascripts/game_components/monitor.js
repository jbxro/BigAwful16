GameClient.Monitor = function(conflux, game, x, y, group, buttons, correctInput) {
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
GameClient.Monitor.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Monitor.prototype.constructor = GameClient.Monitor;


