class Game < ApplicationRecord
  has_one :grandpa, dependent: :destroy
  has_one :grandson, dependent: :destroy
  has_one :translator, dependent: :destroy
  has_many :messages

  after_create(:add_translator)

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
    if(commands.empty?)
      commands = ["Well, I say! I say!"]
    end
    message = "#{user.type}: #{commands.join(' ')}"
    ActionCable.server.broadcast "game_#{id}",
      action: "message",
      message: message
  end

  def start
    # Send out word lists
    ActionCable.server.broadcast "player_#{grandson.cid}",
      action: 'populateWordList',
      message: translator.grandson_wordbank
    ActionCable.server.broadcast "player_#{grandpa.cid}",
      action: 'populateWordList',
      message: translator.grandpa_wordbank
      
    # Messages to Grandson
    ActionCable.server.broadcast "player_#{grandson.cid}",
      action: 'message',
      message: "The phone rings. You answer it."
    ActionCable.server.broadcast "player_#{grandson.cid}",
      action: 'message',
      message: "oh no it's grandpa"
    ActionCable.server.broadcast "player_#{grandson.cid}",
      action: 'updateStatus',
      message: "Providing Tech Support"

    # Messages to Grandpa
    ActionCable.server.broadcast "player_#{grandpa.cid}",
      action: 'message',
      message: "Your grandson picks up the phone."
    ActionCable.server.broadcast "player_#{grandpa.cid}",
      action: 'updateStatus',
      message: "Receiving Help"
  end

private
  def add_translator
    self.translator = Translator.create
  end
end
