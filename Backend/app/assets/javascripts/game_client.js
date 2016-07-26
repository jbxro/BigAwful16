GameClient = {
  start: function(gameType, id, data){
    var game = new Phaser.Game(1200, 700, Phaser.CANVAS, document.getElementById("main"));
    WebFontConfig = {
      //  'active' means all requested fonts have finished loading
      //  We set a 1 second delay before calling 'createText'.
      //  For some reason if we don't the browser cannot render the text the first time it's created.
      active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
      //  The Google Fonts we want to load (specify as many as you like in the array)
      google: {
        families: ['Roboto']
      }
    };
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
