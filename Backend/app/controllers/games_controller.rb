class GamesController < ApplicationController
  def join
    if(params[:as] == 'grandpa')
      @user = Grandpa.create!(difficulty: params[:difficulty])
    else
      @user = Grandson.create!(difficulty: params[:difficulty])
    end
    @game = Game.join_or_create(@user)
  end
end
