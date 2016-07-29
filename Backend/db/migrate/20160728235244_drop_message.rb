class DropMessage < ActiveRecord::Migration[5.0]
  def up
    drop_table :messages
  end
end
