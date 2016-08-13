class AddDifficultyToGrandpa < ActiveRecord::Migration[5.0]
  def change
    add_column :grandpas, :difficulty, :integer
  end
end
