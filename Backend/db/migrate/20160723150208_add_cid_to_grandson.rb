class AddCidToGrandson < ActiveRecord::Migration[5.0]
  def change
    add_column :grandsons, :cid, :integer
  end
end
