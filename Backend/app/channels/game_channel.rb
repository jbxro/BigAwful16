# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "player_#{uuid}"
  end

  def unsubscribed
    if(@game.grandpa.nil? || @game.grandson.nil?)
      @game.destroy
    elsif(@user.type == 'Grandpa')
      ActionCable.server.broadcast "game_#{@game.id}",
        action: 'message',
        message: "Grandpa has died. The call is over. You are free."
      @game.destroy
    elsif(@user.type == 'Grandson')
      ActionCable.server.broadcast "game_#{@game.id}",
        action: 'message',
        message: "Your grandson has left, but your task is still unsolved..."
    end
  end

  def register(data)
    if(data['type'] == 'Grandson')
      @user = Grandson.find(data['id'])
    else
      @user = Grandpa.find(data['id'])
    end
    @user.cid = uuid
    @user.save!

    @game = @user.game
    stream_from "game_#{@game.id}"

    if(@user.type == 'Grandpa')
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'message',
        message: "You need help. You dial the phone, and pray your grandson answers. He knows computers."
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'updateStatus',
        message: "Waiting for your Grandson to pick up the phone"
    end

    if(@user.type == 'Grandson')
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'message',
        message: "You settle in for a nice, long gaming session. You've had a busy week, and are looking forward to the opportunity to relax."
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'updateStatus',
        message: "Enjoying yourself"
    end

    if(@game.grandson && @game.grandpa)
      ActionCable.server.broadcast "player_#{@game.grandson.cid}",
        action: 'message',
        message: "The phone rings. You answer it."
      ActionCable.server.broadcast "player_#{@game.grandson.cid}",
        action: 'message',
        message: "oh no it's grandpa"
      ActionCable.server.broadcast "player_#{@game.grandson.cid}",
        action: 'updateStatus',
        message: "Providing Tech Support"

      ActionCable.server.broadcast "player_#{@game.grandpa.cid}",
        action: 'message',
        message: "Your grandson picks up the phone."
      ActionCable.server.broadcast "player_#{@game.grandpa.cid}",
        action: 'updateStatus',
        message: "Receiving Help"
    end
  end

  def says(data)
    @game.send_message(@user, data)
  end
end
