class CreateLobbies < ActiveRecord::Migration[5.0]
  def change
    create_table :lobbies do |t|
      t.integer :idle_count

      t.timestamps
    end
  end
end
