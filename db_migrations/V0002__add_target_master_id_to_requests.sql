ALTER TABLE t_p3896276_service_station_app.requests
  ADD COLUMN IF NOT EXISTS target_master_id INT REFERENCES t_p3896276_service_station_app.masters(id);