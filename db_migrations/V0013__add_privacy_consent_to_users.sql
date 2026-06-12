ALTER TABLE t_p3896276_service_station_app.users
  ADD COLUMN IF NOT EXISTS privacy_accepted_at timestamp with time zone NULL,
  ADD COLUMN IF NOT EXISTS privacy_version text NULL;