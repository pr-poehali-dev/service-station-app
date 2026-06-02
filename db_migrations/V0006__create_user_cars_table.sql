CREATE TABLE t_p3896276_service_station_app.user_cars (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES t_p3896276_service_station_app.users(id),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  vin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);