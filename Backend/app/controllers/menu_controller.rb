class MenuController < ApplicationController
  def home
    games = Game.all
    @grandpa_games = games.select{|g| g.grandpa.nil? && g.grandson.present?}
    @grandson_games = games.select{|g| g.grandson.nil? && g.grandpa.present?}
  end
end
