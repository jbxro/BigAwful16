App.connect_to_menu = ->
  App.menu = App.cable.subscriptions.create "MenuChannel",
    received: (data) ->
      @[data.action](data)
    
    message: (data) ->
      $('#message-log').append(jQuery('<div></div>').text(data.message))

    incrementAvailableGrandpas: (data) ->
      element = $('.grandpa-count')
      element.text( Number(element.text())+1 )

    decrementAvailableGrandpas: (data) ->
      element = $('.grandpa-count')
      element.text( Number(element.text())-1 )

    incrementAvailableGrandsons: (data) ->
      element = $('.grandson-count')
      element.text( Number(element.text())+1 )

    decrementAvailableGrandsons: (data) ->
      element = $('.grandson-count')
      element.text( Number(element.text())-1 )
