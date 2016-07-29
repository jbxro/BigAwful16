GameClient.Tower = function(conflux, game, grandpasTower) {
  // object to store states, not a sprite
  // has to be updated manually
  this.powerOn = false;
  this.sendingData = false;
  this.pluggedIn = false;

  this.sfx = game.add.audio('comp_noise');
  this.sfx.volume = 0;
  this.sfx.loop = true;
  this.sfx.play();

  // translate JSON spec to switch states
  // e.g. tower is on if switch is set to false (left position)
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

  this.update = function(){
    // toggle sound on/off
    if(this.powerOn){
      this.sfx.volume = 0.5;
    } else {
      this.sfx.volume = 0;
    }
  }

}
GameClient.Tower.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Tower.prototype.constructor = GameClient.Tower;
