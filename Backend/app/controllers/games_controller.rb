class GamesController < ApplicationController
  def join
    if(params[:as] == 'grandpa')
      @user = Grandpa.create!()
    else
      @user = Grandson.create!()
    end
    @game = Game.join_or_create(@user)
  end
end
