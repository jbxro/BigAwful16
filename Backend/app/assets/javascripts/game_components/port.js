GameClient.Port = function(conflux, game, x, y, group, correct) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'port');
  group.add(this);
  this.pluggedCable = this.game.add.sprite(this.x, this.y, 'cablesPluggedPort');
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
    if((this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.data]) && correct){
      conflux.monitor.connected = true;
      conflux.addFrustration(-10);
    }
  }

  this.unplug = function(){
    if(this.pluggedIn){
      this.sfx.play();
      this.cable.toggleDrag();
      this.pluggedCable.visible = false;
      this.pluggedIn = false;
      if((this.pluggedCable.frame == conflux.colors[conflux.grandpasMonitor.monitorCables.data]) && correct){
        conflux.monitor.connected = false;
      }
      conflux.addFrustration(10);
    }
  }
}
GameClient.Port.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Port.prototype.constructor = GameClient.Port;
