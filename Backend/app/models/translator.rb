class Translator < ApplicationRecord
  MASTER_LIST = YAML.load_file("#{Rails.root}/config/word_list.yml")
  
  [:grandpa_wordbank, :grandson_wordbank, :grandpa_dictionary, :grandson_dictionary].each{|o| serialize o}
  belongs_to :game

  before_create :build_dictionaries_and_wordbanks

  def build_dictionaries_and_wordbanks
    self.grandpa_wordbank = {families: []}
    self.grandson_wordbank = {families: []}
    self.grandpa_dictionary = {}
    self.grandson_dictionary = {}
    MASTER_LIST.each do |target, families|
      for_grandpa = ['grandpa','both'].include?(target)
      for_grandson = ['grandson','both'].include?(target)
      families.each do |family, definitions|
        if for_grandpa
          self.grandpa_wordbank[:families] << family
          self.grandpa_wordbank[family] ||= []
        end
        if for_grandson
          self.grandson_wordbank[:families] << family
          self.grandson_wordbank[family] ||= []
        end
        definitions.each do |word, translations|
          translation = translations.sample || word
          if for_grandpa
            self.grandpa_dictionary[word] = translation 
            self.grandpa_wordbank[family] << word
          end
          if for_grandson
            self.grandson_dictionary[word] = translation 
            self.grandson_wordbank[family] << word
          end
        end
      end
    end
    self.grandpa_wordbank.each{|label, list| list.sort!}
    self.grandson_wordbank.each{|label, list| list.sort!}
  end
end
