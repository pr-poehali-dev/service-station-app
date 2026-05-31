ALTER TABLE t_p3896276_service_station_app.users
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'client',
  ADD COLUMN IF NOT EXISTS master_id INT REFERENCES t_p3896276_service_station_app.masters(id);

ALTER TABLE t_p3896276_service_station_app.users
  ADD CONSTRAINT users_phone_unique UNIQUE (phone);
