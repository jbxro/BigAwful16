GameClient.Tower = function(conflux, game, grandpasTower) {
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
GameClient.Tower.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Tower.prototype.constructor = GameClient.Tower;
