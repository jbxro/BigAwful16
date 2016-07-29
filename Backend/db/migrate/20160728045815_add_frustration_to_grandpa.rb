class AddFrustrationToGrandpa < ActiveRecord::Migration[5.0]
  def change
    add_column :grandpas, :frustration, :integer
  end
end
