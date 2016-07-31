class HighScore < ApplicationRecord
  has_one :game

  def duration
    if end_time && start_time
      (end_time - start_time).to_f
    else
      0
    end
  end

  def formatted_duration
    s = (duration%60).round(2)
    m = (duration/60).floor
    string = "#{m} minute#{m > 1 ? 's':''}, #{s} second#{s > 1 ? 's':''}"
  end
end
