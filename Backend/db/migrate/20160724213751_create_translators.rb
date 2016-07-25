class CreateTranslators < ActiveRecord::Migration[5.0]
  def change
    create_table :translators do |t|
      t.text :grandpa_wordbank
      t.text :grandson_wordbank
      t.text :grandpa_dictionary
      t.text :grandson_dictionary

      t.timestamps
    end
  end
end
