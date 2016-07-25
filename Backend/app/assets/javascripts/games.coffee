# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

App.Game = class Game
  constructor: (@websocket) ->
    @word_list = {}
    $('#message-builder').submit(@submitMessage)

  submitMessage: (event) =>
    event.preventDefault()
    message = [1,2,3]
    @websocket.perform('says', {message: message})

  updateStatus: (message) ->
    $('#status').text(message)

  updateLog: (message) ->
    $('#message-log').append(jQuery('<div></div>').text(message))

  updateWordList: (message) ->
    @wordList = message
    @wordListElement = $('#word-list')
    @addFamily(family) for family in @wordList.families

  addFamily: (family) =>
    familyElement = $('<div></div>').addClass(''+family+'-element family-container')
    familyElement.append($('<h5></h5>').text(family))
    @wordListElement.append(familyElement)
    @addWord(word, familyElement) for word in @wordList[family]

  addWord: (word, familyElement) =>
    wordElement = $('<div></div>').addClass('word').text(word)
    familyElement.append(wordElement)
