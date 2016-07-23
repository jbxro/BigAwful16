class Grandpa < ApplicationRecord
  belongs_to :game

  def type
    'Grandpa'
  end
end
