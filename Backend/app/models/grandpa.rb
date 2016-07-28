class Grandpa < ApplicationRecord
  belongs_to :game

  def type
    'Grandpa'
  end

  def update_frustration(value)
    self.frustration = value
    save!
    ActionCable.server.broadcast "game_#{game.id}",
      action: "message",
      message: "Grandpa's frustration is now at "+value.to_s+"%."
  end
end
