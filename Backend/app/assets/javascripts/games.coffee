# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

App.Game = class Game
  constructor: (@websocket) ->
    @screen = 
    @wordList = {}
    @messageBlock = []
    @wordListElement = $('#word-list')
    @messageBlockElement = $('#message-block')
    $('#message-builder').submit(@submitMessage)
    GameClient.start("grandson", 0, GameClient.data);

  submitMessage: (event) =>
    event.preventDefault()
    @websocket.perform('says', {message: @messageBlock})
    @clearMessage()

  updateStatus: (message) ->
    $('#status').text(message)

  updateLog: (message) ->
    $('#message-log').append(jQuery('<div></div>').text(message))

  updateWordList: (message) ->
    @wordList = message
    @addFamily(family) for family in @wordList.families

  addFamily: (family) =>
    familyElement = $('<div></div>').addClass(''+family+'-element family-container')
    familyElement.append($('<h5></h5>').text(family))
    @wordListElement.append(familyElement)
    @addWord(word, family, familyElement) for word in @wordList[family]

  addWord: (word, family, familyElement) =>
    wordElement = $('<div></div>').addClass('word').text(word)
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
    wordElement = $('<span></span').addClass('word').text(word)
    @messageBlockElement.append(wordElement)

  clearMessage: ->
    @messageBlock = []
    @messageBlockElement.html('')
