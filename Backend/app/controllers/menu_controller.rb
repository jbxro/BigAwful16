class MenuController < ApplicationController
  def home
    @grandson_games = Game.needs_grandpas
    @grandpa_games = Game.needs_grandsons
  end
end
