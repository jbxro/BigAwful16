App.connect_to_menu = ->
  App.menu = App.cable.subscriptions.create "MenuChannel",
    received: (data) ->
      this[data.action](data)
    
    message: (data) ->
      $('.message-log').append(jQuery('<div></div>').text(data.message))

    incrementGrandpaGames: (data) ->
      element = $('.grandson-count')
      element.text( Number(element.text)+1 )

    decrementGrandpaGames: (data) ->
      element = $('.grandson-count')
      element.text( Number(element.text)-1 )

    incrementGrandsonGames: (data) ->
      element = $('.grandpa-count')
      element.text( Number(element.text)+1 )

    decrementGrandsonGames: (data) ->
      element = $('.grandpa-count')
      element.text( Number(element.text)-1 )
