class AddHighScoresToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :high_score_id, :integer
  end
end
