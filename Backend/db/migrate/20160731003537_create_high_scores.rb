class CreateHighScores < ActiveRecord::Migration[5.0]
  def change
    create_table :high_scores do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.string :status

      t.timestamps
    end
  end
end
