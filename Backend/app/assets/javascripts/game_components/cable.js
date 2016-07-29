GameClient.Cable = function(conflux, game, x, y, group, color) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, 'cablesFloating');
  group.add(this);
  this.frame = color;
  this.visible = false;
  this.active = false;
  this.plugged = false;
  this.inputEnabled = true;
  this.input.enableDrag(false, true); // probably unnecessary?
  this.anchor.x = 0.44;

  this.toggleDrag = function(){
    this.active = !this.active;
    this.visible = !this.visible;
  }

  this.update = function(){
    // make the cable follow the cursor
    if(this.active){
      this.x = game.input.x;
      this.y = game.input.y+10;
    }
  }
}
GameClient.Cable.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Cable.prototype.constructor = GameClient.Cable;
