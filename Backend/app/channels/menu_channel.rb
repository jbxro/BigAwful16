class MenuChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'menu'

    ActionCable.server.broadcast 'menu',
      action: 'message',
      message: 'User joined lobby'
  end

  def unsubscribed
    ActionCable.server.broadcast 'menu',
      action: 'message',
      message: 'User left lobby'
  end

  def speak
  end
end
