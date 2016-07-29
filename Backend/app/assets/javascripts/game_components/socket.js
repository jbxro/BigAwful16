GameClient.Socket = function(conflux, game, x, y, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'socket');
  group.add(this);
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedOutlet');
  this.pluggedCable.visible = false;
  this.pluggedIn = false;

  this.sfx = game.add.audio('plug');

  this.plug = function(cable){
    this.sfx.play();
    this.cable = cable;
    this.cable.toggleDrag();
    this.pluggedIn = true;
    this.pluggedCable.visible = true;
    this.pluggedCable.frame = cable.frame;
    if(this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.power]){
      conflux.monitor.pluggedIn = true;
      conflux.addFrustration(-10);
    }
    if(this.pluggedCable.frame == conflux.colors[conflux.grandpasTower.towerCable]){
      conflux.tower.pluggedIn = true;
      conflux.addFrustration(-10);
    }
  }

  this.unplug = function(){
    if(this.pluggedIn){
      this.sfx.play();
      this.cable.toggleDrag();
      this.pluggedCable.visible = false;
      this.pluggedIn = false;
      if(this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.power]){
        conflux.monitor.pluggedIn = false;
      }
      if(this.pluggedCable.frame == conflux.colors[conflux.grandpasTower.towerCable]){
        conflux.tower.pluggedIn = false;
      }
      conflux.addFrustration(10);
    }
  }
}
GameClient.Socket.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Socket.prototype.constructor = GameClient.Socket;
