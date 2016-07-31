class MenuController < ApplicationController
  def home
    @high_scores = HighScore.all.sort{|hs| hs.duration}.select{|hs| hs.status}
    @grandson_games = Game.needs_grandpas
    @grandpa_games = Game.needs_grandsons
  end
end
