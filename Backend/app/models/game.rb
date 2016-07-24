class Game < ApplicationRecord
  has_one :grandpa, dependent: :destroy
  has_one :grandson, dependent: :destroy
  has_many :messages

  default_scope { order('created_at') } 

  def self.needs_grandpas
    Game.all.select{|g| g.grandpa.nil? && g.grandson.present?}
  end

  def self.needs_grandsons
    Game.all.select{|g| g.grandson.nil? && g.grandpa.present?}
  end

  def self.join_or_create(user)
    if(user.class == Grandpa)
      games = Game.needs_grandpas
      if(games.empty?)
        game = Game.create(grandpa: user)
        ActionCable.server.broadcast "menu", action: "incrementAvailableGrandpas"
      else
        game = games.first
        game.grandpa = user
        game.save!
        ActionCable.server.broadcast "menu", action: "decrementAvailableGrandsons"
      end
    elsif(user.class == Grandson)
      games = Game.needs_grandsons
      if(games.empty?)
        game = Game.create(grandson: user)
        ActionCable.server.broadcast "menu", action: "incrementAvailableGrandsons"
      else
        game = games.first
        game.grandson = user
        game.save!
        ActionCable.server.broadcast "menu", action: "decrementAvailableGrandpas"
      end
    else
      raise "You done fucked up."
    end
    game
  end

  def send_message(user, commands)
    message = "#{user.type}: Well, I say! I say!"
    ActionCable.server.broadcast "game_#{id}",
      action: "message",
      message: message
  end

  def anti(user)
    [grandpa, grandson].select{|u| u!=user}
  end
end
