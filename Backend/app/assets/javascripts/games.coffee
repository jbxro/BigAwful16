# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

App.Game = class Game
  constructor: (@websocket) ->
    @wordList = {}
    @messageBlock = []
    @wordListElement = $('#word-list')
    @messageBlockElement = $('#message-block')
    @builderEl = $('#builder')
    @mainEl = $('#main')
    @leftTab = $('#left-tab')
    @rightTab = $('#right-tab')
    $('#message-builder').submit(@submitMessage)
    @leftTab.click(@viewMain)
    @rightTab.click(@viewBuilder)

  viewMain: =>
    if(!@builderEl.hasClass('hidden'))
      @builderEl.addClass('hidden')
      @rightTab.removeClass('selected')
      @leftTab.addClass('selected')
      @mainEl.removeClass('hidden')

  viewBuilder: =>
    if(!@mainEl.hasClass('hidden'))
      @mainEl.addClass('hidden')
      @leftTab.removeClass('selected')
      @rightTab.addClass('selected')
      @builderEl.removeClass('hidden')

  submitMessage: (event) =>
    event.preventDefault()
    @websocket.perform('says', {message: @messageBlock})
    @clearMessage()

  updateStatus: (message) ->
    $('#status').text(message)

  updateLog: (message) ->
    $('#message-log').append(jQuery('<div></div>').html(message))

  updateWordList: (message) ->
    @wordList = message
    keys = Object.keys(@wordList)
    keys.sort (a, b)=>
      @wordList[b].length - @wordList[a].length
    @addFamily(family) for family in keys
  addFamily: (family) =>
    familyElement = $('<div></div>').addClass(''+family+'-element family-container')
    familyElement.append($('<h5></h5>').text(family))
    @wordListElement.append(familyElement)
    @addWord(word, family, familyElement) for word in @wordList[family]

  addWord: (word, family, familyElement) =>
    wordElement = $('<div></div>').addClass('word').html(word)
    if(word in ['red','blue','green','purple','yellow'])
      wordElement.addClass(word)
    wordElement.data('family', family).data('word', word)
    familyElement.append(wordElement)
    wordElement.click(@clickWord)
  
  clickWord: (event) =>
    wordElement = $(event.target)
    word = wordElement.data('word')
    family = wordElement.data('family')
    @addMessageBlock(word, family)

  addMessageBlock: (word, family) ->
    @messageBlock.push(word)
    wordElement = $('<span></span').addClass('word').html(word)
    if(word in ['red','blue','green','purple','yellow'])
      wordElement.addClass(word)
    @messageBlockElement.append(wordElement)

  clearMessage: ->
    @messageBlock = []
    @messageBlockElement.html('')
