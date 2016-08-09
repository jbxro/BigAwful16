App.connect_to_game = (user_type, user_id)->
  App.cable.subscriptions.create "GameChannel",
    # RESPONSES
    connected: ->
      @perform('register', {type: user_type, id: user_id})
      @game = new App.Game(@, user_type)

    received: (data) ->
      @[data.action](data)

    win: ->
      GameClient.gameState.triggerWin(false)
    
    lose: ->
      GameClient.gameState.triggerWin(true)

    message: (data) ->
      @game.updateLog(data.message)

    updateStatus: (data) ->
      @game.updateStatus(data.message)

    populateWordList: (data) ->
      @game.updateWordList(data.message)

    startClient: (data) ->
      $('#builder .header').show()
      $('.client-placeholder').remove()
      data.message.subscription = @
      if(user_type=='Grandpa')
        GameClient.start(user_type, 0, data.message, 'main')
      else
        GameClient.start(user_type, 0, data.message, 'monitor')
        GameClient.start(user_type, 0, data.message, 'tower')
