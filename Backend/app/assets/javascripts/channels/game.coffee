App.connect_to_game = (user_type, user_id)->
  App.game = App.cable.subscriptions.create "GameChannel",
    # RESPONSES
    connected: ->
      @perform('register', {type: user_type, id: user_id})

      $('#message-builder').submit(@submit_message)

    received: (data) ->
      @[data.action](data)

    message: (data) ->
      $('#message-log').append(jQuery('<div></div>').text(data.message))

    updateStatus: (data) ->
      $('#status').text(data.message)

    # ACTIONS
    submit_message: (event) =>
      event.preventDefault()
      message = [1,2,3]
      App.game.perform('says', {message: message})
