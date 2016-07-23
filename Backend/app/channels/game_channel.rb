# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "player_#{uuid}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def register(data)
    if(data['type'] == 'Grandson')
      grand = Grandson.find(data['id'])
      ActionCable.server.broadcast 'menu',
        action: 'message',
        message: 'User became a Grandson'
    else
      grand = Grandpa.find(data['id'])
      ActionCable.server.broadcast 'menu',
        action: 'message',
        message: 'User became a Grandpa'
    end
    grand.cid = uuid
    grand.save!
  end

  def speak
  end
end
