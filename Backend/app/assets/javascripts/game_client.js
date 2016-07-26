GameClient = {
  start: function(gameType, id, data){
    var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById("main"));
    game.state.add('GrandpaGame', GameClient.GFG.GrandpaGame);
    game.state.add('GrandsonGame', GameClient.GFG.GrandsonGame);
    switch (gameType) {
      case 'grandpa':
        game.state.start('GrandpaGame', false, true, data);
        break;
      case 'grandson':
        game.state.start('GrandsonGame', false, true, data);
        break;
      default:
        console.log('invalid game type')
        return 1;
    }
  },
  data: {},
  GFG: {}
}
