class AddCidToGrandpa < ActiveRecord::Migration[5.0]
  def change
    add_column :grandpas, :cid, :string
  end
end
