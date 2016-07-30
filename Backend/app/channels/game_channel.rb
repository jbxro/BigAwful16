# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "player_#{uuid}"
  end

  def unsubscribed
    if(@game.reload)
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
    stream_from "game_#{@game.reload.id}"
    @translator = @game.translator

    # If the Grandpa is registering...
    if(@user.type == 'Grandpa')
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'message',
        message: "You need help. You dial the phone, and pray your grandson answers. He knows computers."
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'updateStatus',
        message: "Waiting for your Grandson to pick up the phone"
    end

    # If the grandson is registering...
    if(@user.type == 'Grandson')
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'message',
        message: "You settle in for a nice, long gaming session. You've had a busy week, and are looking forward to the opportunity to relax."
      ActionCable.server.broadcast "player_#{@user.cid}",
        action: 'updateStatus',
        message: "Enjoying yourself"
    end

    # If both users are now registered, start the game!
    if(@game.grandson && @game.grandpa)
      @game.start()
    end
  end
  
  def says(data)
    @game.reload.send_message(@user, data['message'])
  end

  def set_frustration(data)
    @game.reload.grandpa.update_frustration(data['message'].to_i)
  end

  def win
    ActionCable.server.broadcast "player_#{@game.grandson.cid}",
      action: 'win'
    ActionCable.server.broadcast "game_#{@game.id}",
      action: 'message',
      message: "Grandpa has successfully turned on his computer. The game is over."
    ActionCable.server.broadcast "player_#{@game.grandpa.cid}",
      action: 'updateStatus',
      message: "Finally getting things done"
    ActionCable.server.broadcast "player_#{@game.grandson.cid}",
      action: 'updateStatus',
      message: "Enjoying yourself"
  end

  def lose
    ActionCable.server.broadcast "player_#{@game.reload.grandson.cid}",
      action: 'lose'
    ActionCable.server.broadcast "game_#{@game.id}",
      action: 'message',
      message: "Grandpa has given up. The game is over."
    ActionCable.server.broadcast "player_#{@game.grandpa.cid}",
      action: 'updateStatus',
      message: "Finally getting things done"
    ActionCable.server.broadcast "player_#{@game.grandson.cid}",
      action: 'updateStatus',
      message: "Enjoying yourself"
  end
end
