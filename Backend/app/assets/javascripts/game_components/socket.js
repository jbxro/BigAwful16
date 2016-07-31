GameClient.Socket = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'socket');
  group.add(this);
  // add (hidden) sprite with cable plugged in
  // this sprite is visible when there is a cable plugged into socket
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedOutlet');
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
    // check if correct power cables are connected to socket
    if(this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.power]){
      conflux.monitor.pluggedIn = true;
    }
    if(this.pluggedCable.frame == conflux.colors[conflux.grandpasTower.towerCable]){
      conflux.tower.pluggedIn = true;
    }
  }

  // unplug whatever is plugged in
  this.unplug = function(){
    if(this.pluggedIn){
      this.sfx.play();
      this.cable.toggleDrag();
      this.pluggedCable.visible = false;
      this.pluggedIn = false;
      // turn off devices if unplugged from power
      if(this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.power]){
        conflux.monitor.pluggedIn = false;
      }
      if(this.pluggedCable.frame == conflux.colors[conflux.grandpasTower.towerCable]){
        conflux.tower.pluggedIn = false;
      }
      // switching cables is frustrating, and the user is prevented from infinitely dropping frustration
      conflux.addFrustration(10);
    }
  }
}
GameClient.Socket.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Socket.prototype.constructor = GameClient.Socket;
