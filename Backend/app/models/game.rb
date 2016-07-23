class Game < ApplicationRecord
  has_one :grandpa
  has_one :grandson
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
      else
        game = games.first
        game.grandpa = user
        game.save!
      end
    elsif(user.class == Grandson)
      games = Game.needs_grandsons
      if(games.empty?)
        game = Game.create(grandson: user)
      else
        game = games.first
        game.grandson = user
        game.save!
      end
    else
      raise "You done fucked up."
    end
    game
  end
end
