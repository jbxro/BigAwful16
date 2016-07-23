App.connect_to_game = (user_type, user_id)->
  App.game = App.cable.subscriptions.create "GameChannel",
    connected: ->
      @perform('register', {type: user_type, id: user_id})
      # Register this user as a thing

    received: (data) ->
      # Called when there's incoming data on the websocket for this channel

    speak: ->
      @perform 'speak'
