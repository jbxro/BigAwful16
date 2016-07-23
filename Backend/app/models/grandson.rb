class Grandson < ApplicationRecord
  belongs_to :game

  def type
    'Grandson'
  end
end
