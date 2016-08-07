GameClient = {
  start: function(gameType, id, data, target){
    var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById(target));
    game.state.add('GrandpaGame', GameClient.GFG.GrandpaGame);
    game.state.add('GrandsonGame', GameClient.GFG.GrandsonGame);
    switch (gameType) {
      case 'Grandpa':
        game.state.start('GrandpaGame', false, true, data);
        break;
      case 'Grandson':
        if(target == 'monitor'){
          game.state.start('GrandsonMonitors', false, true, data);
        }else{
          game.state.start('GrandsonTowers', false, true, data);
        }
        break;
      default:
        console.log('invalid game type')
        return 1;
    }
  },
  data: {},
  GFG: {}
}
