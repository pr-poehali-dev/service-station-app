ALTER TABLE t_p3896276_service_station_app.push_subscriptions
  ALTER COLUMN master_id SET DEFAULT NULL;

UPDATE t_p3896276_service_station_app.push_subscriptions
  SET master_id = NULL WHERE master_id IS NOT NULL AND user_id IS NOT NULL;
