class Translator < ApplicationRecord
  MASTER_LIST = YAML.load_file("#{Rails.root}/config/word_list.yml")
  DIGRESSIONS = YAML.load_file("#{Rails.root}/config/digressions.yml")
  
  [:grandpa_wordbank, :grandson_wordbank, :grandpa_dictionary, :grandson_dictionary].each{|o| serialize o}
  belongs_to :game

  before_create :build_dictionaries_and_wordbanks

  def build_dictionaries_and_wordbanks
    self.grandpa_wordbank = {}
    self.grandson_wordbank = {}
    self.grandpa_dictionary = {}
    self.grandson_dictionary = {}
    MASTER_LIST.each do |target, families|
      for_grandpa = ['grandpa','both'].include?(target)
      for_grandson = ['grandson','both'].include?(target)
      families.each do |family, definitions|
        if for_grandpa
          self.grandpa_wordbank[family] ||= []
        end
        if for_grandson
          self.grandson_wordbank[family] ||= []
        end
        definitions ||= []
        definitions.each do |word, translations|
          if for_grandpa
            self.grandpa_dictionary[word] ||= []
            self.grandpa_dictionary[word].concat(translations).uniq!
            self.grandpa_wordbank[family] << word unless self.grandpa_wordbank[family].include?(word)
          end
          if for_grandson
            self.grandson_dictionary[word] ||= []
            self.grandson_dictionary[word].concat(translations).uniq!
            self.grandson_wordbank[family] << word unless self.grandson_wordbank[family].include?(word)
          end
        end
      end
    end
    self.grandpa_dictionary = self.grandpa_dictionary.inject({}) do |hash, (key, value)|
      hash[key] = value.push(key).sample
      hash
    end
    self.grandson_dictionary = self.grandson_dictionary.inject({}) do |hash, (key, value)|
      hash[key] = value.push(key).sample
      hash
    end
    self.grandpa_wordbank.each{|label, list| list.sort!}
    self.grandson_wordbank.each{|label, list| list.sort!}
  end

  def translate(user, word_list)
    response = ""

    word_list = word_list.map do |word|
      if(user.type == 'Grandpa')
        word = grandpa_dictionary[word]
        # 1 in 3 chance any noun just becomes a generic noun
        if grandpa_wordbank['nouns'].include?(word)
          if(rand(3)==1)
            word = generic_noun
          end
          if(rand(user.frustration) > 35)
            word = aggressify(word)
          end
        end
      elsif(user.type == 'Grandson')
        word = grandson_dictionary[word]
      end
      word
    end
    if(user.type == 'Grandpa')
      start_digression = false
      word_list.each_index do |index|
        if rand(100)==50
          start_digression ||= index
        end
      end
      if start_digression
        word_list = word_list.first(start_digression+1)
        word_list.push << new_digression()
      end
    end
    word_list.join(' ')
  end

  def new_digression
    digression = ""
    digression << DIGRESSIONS['intros'].sample
    digression << DIGRESSIONS['stories'].sample
    while(true)
      chance = rand(3)
      if(chance == 0)
        break
      elsif(chance == 1)
        digression << DIGRESSIONS['stories'].sample
      else
        digression << DIGRESSIONS['combiners'].sample
        digression << DIGRESSIONS['stories'].sample
      end
    end
    digression
  end

  def generic_noun
    "thing"
  end

  def aggressify(word)
    ["god damn", "feckin'", "bloody", "stupid", "ARGH", "pissy", "damned", "fangled"].sample+" "+word
  end
end
