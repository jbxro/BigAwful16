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
      commands = ["Well, I mean... I dunno. Nevermind."]
    end
    message = "#{user.type}: #{translator.translate(user, commands)}"
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

  def test_data
    {
      # Make sure that grandpa's computer and tower don't share cable colors!
      "grandpasHardware": {"monitor": 2,"tower": 1}, # randomized 0 - 2
      "monitors":[ # array of possible monitors
        {
          "name": "SCL-50EX", # (semi)randomly generated
          "type": "XVD", # XVD or SGA (replace with something funny later)
          "logo": 2, # just in case
          "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
          # 12 possible button slots, fill up 4:
          # 0 - empty
          # 1 - power
          # 2 - input
          # 3 - degauss
          # 4 - nothing
          "monitorCables": {"power": "blue", "data": "red"},
          # Possible colors:
          # blue, green, yellow, red, purple
          "monitorInput": 2 # number of active input. randomized in range 0 - 3
        },

        {
          "name": "AFG121",
          "logo": 2,
          "type": "SGA",
          "monitorButtons": [0,2,0,0,0,0,0,0,0,1,4,3],
          "monitorCables": {"power": "green", "data": "purple"},
          "monitorInput": 2
        },

        {
          "name": "WMM59T",
          "logo": 2,
          "type": "SGA",
          "monitorButtons": [0,0,1,4,0,0,2,3,0,0,4,0],
          "monitorCables": {"power": "red", "data": "blue"},
          "monitorInput": 2
        }
      ],

      "towers": [ # array of possible towers
        {
          "name": "Super-1",
          "logo": 3,
          "towerPort": 0, # correct port to connect monitor - randomize 0 - 3
          "towerCable": "green",
          "roundButtons": [1,0], # randomize 0 - 2
          "squareButtons": [2,2], # randomize 0 - 2
          "towerSwitches": {"powerOn": "left", "monitorXVD": "right"} # randomize left or right
        },

        {
          "name": "Grinder XT",
          "logo": 3,
          "towerPort": 2,
          "towerCable": "red",
          "roundButtons": [1,2],
          "squareButtons": [1,2],
          "towerSwitches": {"powerOn": "left", "monitorXVD": "right"}
        },

        {
          "name": "Mesa Supreme",
          "logo": 3,
          "towerPort": 1,
          "towerCable": "purple",
          "roundButtons": [2,1],
          "squareButtons": [1,0],
          "towerSwitches": {"powerOn": "left", "monitorXVD": "right"}
        }

      ]
    }
  end

private
  def add_translator
    self.translator = Translator.create
  end
end
