class Game < ApplicationRecord
  serialize :definition
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
    self.definition = generate_definition
    save!
    ActionCable.server.broadcast "game_#{id}",
        action: 'startClient',
        message: definition 

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

  def generate_definition
    monitors = generate_monitors
    towers = generate_towers
    definition = {
      grandpasHardware: { monitor: rand(3), tower: rand(3) },
      monitors: monitors,
      towers: towers
    }
    definition
  end
  
  def generate_monitors
    monitors = []
    shuffabit = lambda{('a'..'z').to_a.shuffle}
    @possible_monitor_names = [
      "#{shuffabit.call.first(3).join}-#{rand(500).to_s}#{shuffabit.call.first(2).join}",
      "#{shuffabit.call.first(3).join}#{rand(500).to_s}",
      "#{shuffabit.call.first(2).join}-#{shuffabit.call.first(1)}#{rand(2000).to_s}"
    ].shuffle
    3.times do
      @possible_cable_colors = ['blue', 'green', 'red'].shuffle
      monitors << generate_monitor
    end
    monitors
  end

  def generate_monitor
    monitor = { 
      name: generate_monitor_name,
      type: ['XVD', 'SGA'].sample,
      logo: rand(10),
      monitorButtons: generate_monitor_buttons,
      monitorCables: {
        power: @possible_cable_colors.pop,
        data: @possible_cable_colors.pop
      },
      monitorInput: rand(4)
    }
    monitor
  end

  def generate_monitor_name
    @possible_monitor_names.pop
  end

  def generate_monitor_buttons
    buttons = [0,0,0,0,0,0,0,0,0,0,0,0]
    slots = [0,1,2,3,4,5,6,7,8,9,10,11].shuffle
    # 12 possible button slots, 4 possible unique non-zero values:
    # 0: empty, 1: power, 2: input, 3: degauss, 4: nothing
    [1,2,3,4].each do |n|
      index = slots.pop
      buttons[index] = n
    end
    buttons
  end

  def generate_towers
    monitors = []
    @possible_tower_names = [
        "name": "Super-1",
        "name": "Grinder XT",
    ].shuffle
    3.times do
      @possible_cable_colors = ['yellow', 'purple'].shuffle
      monitors << generate_tower
    end
    monitors
  end
  
  def generate_tower
    {
      name: @possible_tower_names.pop,
      logo: rand(4),
      towerCable: @possible_cable_colors.pop,
      roundButtons: [rand(3), rand(3)],
      squareButtons: [rand(3), rand(3)],
      towerSwitches: { powerOn: ['left','right'].sample, monitorXVD: ['left','right'].sample }
    }
  end
  
private
  def add_translator
    self.translator = Translator.create
  end
end
