class Game < ApplicationRecord
  has_one :grandpa
  has_one :grandson
  has_many :messages
end
