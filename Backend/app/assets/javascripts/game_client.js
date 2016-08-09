GameClient = {
  start: function(gameType, id, data, target){
    var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById(target));
    switch (gameType) {
      case 'Grandpa':
        game.state.add('GrandpaGame', GameClient.GFG.GrandpaGame);
        game.state.start('GrandpaGame', false, true, data);
        break;
      case 'Grandson':
        if(target == 'monitor'){
          game.state.add('GrandsonMonitors', GameClient.GFG.GrandsonMonitors);
          game.state.start('GrandsonMonitors', false, true, data);
        }else{
          game.state.add('GrandsonTowers', GameClient.GFG.GrandsonTowers);
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
