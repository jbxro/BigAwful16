class AddDefinitionToGame < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :definition, :text
  end
end
