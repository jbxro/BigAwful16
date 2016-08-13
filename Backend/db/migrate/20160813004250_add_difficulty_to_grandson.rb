class AddDifficultyToGrandson < ActiveRecord::Migration[5.0]
  def change
    add_column :grandsons, :difficulty, :integer
  end
end
