Rails.application.routes.draw do
  get '/game', to: 'games#join'
  get '/', to: 'menu#home'

  mount ActionCable.server => '/cable'
end
