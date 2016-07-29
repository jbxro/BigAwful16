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
        word = grandpa_dictionary[word] || "uh"
        # 1 in 3 chance any noun just becomes a generic noun
        if grandpa_wordbank['nouns'].include?(word)
          if(rand(4)==1 || rand(user.frustration) > 50)
            word = generic_noun
          end
          if(rand(user.frustration) > 25)
            word = aggressify(word)
            if(rand(user.frustration) > 35)
              word = aggressify(word)
            end
          end
        end
        # 1 in 3 chance any number is increased or decreased by 1
        if grandpa_wordbank['count'].include?(word)
          if(rand(3)==1)
            word = word.to_i+[1,-1].sample
            if(word < 1)
              word = 1
            end
            word = word.to_s
          end
        end
      elsif(user.type == 'Grandson')
        word = grandson_dictionary[word]
      end
      colorify(word)
    end
    if(user.type == 'Grandpa')
      start_digression = false
      word_list.each_index do |index|
        if rand(15)==1
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

  def colorify(word)
    if(['red','blue','green','purple','yellow'].include?(word))
      "<span class='#{word} color'>#{word}</span>"
    else
      word
    end
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
    intensifier = ["god damn", "feckin'", "bloody", "stupid", "ARGH", "pissy", "damned", "fangled", "flippin'", "horse-riding", "friznhagin"].sample
    "<span class='emphasis'>#{intensifier} #{word}</span>"
  end
end
