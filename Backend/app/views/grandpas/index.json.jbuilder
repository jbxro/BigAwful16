json.array!(@grandpas) do |grandpa|
  json.extract! grandpa, :id
  json.url grandpa_url(grandpa, format: :json)
end
