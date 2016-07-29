GameClient.Port = function(conflux, game, x, y, group, correct) {
  // the "correct" bool signifies if the port is a display port or now
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'port');
  group.add(this);
  // add (hidden) sprite with cable plugged in
  // this sprite is visible when there is a cable plugged into port
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedPort');
  this.pluggedCable.visible = false;
  this.pluggedIn = false;

  this.sfx = game.add.audio('plug');

  // plug in a cable
  this.plug = function(cable){
    this.sfx.play();
    this.cable = cable;
    this.cable.toggleDrag();
    this.pluggedIn = true;
    this.pluggedCable.visible = true;
    // set color
    this.pluggedCable.frame = cable.frame;
    // check if display data cable is connected to tower display port
    if((this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.data]) && correct){
      conflux.monitor.connected = true;
      // relief
      conflux.addFrustration(-10);
    }
  }

  // unplug whatever is plugged in
  this.unplug = function(){
    if(this.pluggedIn){
      this.sfx.play();
      this.cable.toggleDrag();
      this.pluggedCable.visible = false;
      this.pluggedIn = false;
      if((this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.data]) && correct){
        conflux.monitor.connected = false;
      }
      // switching cables is frustrating, and the user is prevented from infinitely dropping frustration
      conflux.addFrustration(10);
    }
  }
}
GameClient.Port.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Port.prototype.constructor = GameClient.Port;
