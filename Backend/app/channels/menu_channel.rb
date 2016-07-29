class MenuChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'menu'
    if(Lobby.count == 0)
      @lobby = Lobby.create(idle_count: 0)
    end
    @lobby = Lobby.last
    @lobby.update_attribute(:idle_count, @lobby.reload.idle_count+1)

    ActionCable.server.broadcast 'menu',
      action: 'setLobbyCount',
      message: @lobby.reload.idle_count
  end

  def unsubscribed
    @lobby.update_attribute(:idle_count, @lobby.reload.idle_count-1)
    ActionCable.server.broadcast 'menu',
      action: 'setLobbyCount',
      message: @lobby.reload.idle_count
  end

  def speak
  end
end
