class Grandson < ApplicationRecord
  belongs_to :game, optional: true

  def type
    'Grandson'
  end
end
