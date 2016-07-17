json.array!(@grandsons) do |grandson|
  json.extract! grandson, :id
  json.url grandson_url(grandson, format: :json)
end
