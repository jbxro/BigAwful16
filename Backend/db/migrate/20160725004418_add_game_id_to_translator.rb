class AddGameIdToTranslator < ActiveRecord::Migration[5.0]
  def change
    add_column :translators, :game_id, :integer
  end
end
