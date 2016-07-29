GameClient.Button = function(conflux, game, x, y, group, parent, type) {
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

  this.sfx = game.add.audio('button');
  this.sfx.volume = 0.5;

  this.action = function(){
    this.sfx.play();
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
GameClient.Button.prototype = Object.create(Phaser.Sprite.prototype);
GameClient.Button.prototype.constructor = GameClient.Button;
