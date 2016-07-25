App.connect_to_game = (user_type, user_id)->
  App.cable.subscriptions.create "GameChannel",
    # RESPONSES
    connected: ->
      @perform('register', {type: user_type, id: user_id})
      @game = new App.Game(@)

    received: (data) ->
      @[data.action](data)

    message: (data) ->
      @game.updateLog(data.message)

    updateStatus: (data) ->
      @game.updateStatus(data.message)

    populateWordList: (data) ->
      @game.updateWordList(data.message)
