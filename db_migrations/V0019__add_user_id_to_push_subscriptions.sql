ALTER TABLE t_p3896276_service_station_app.push_subscriptions
  ADD COLUMN IF NOT EXISTS user_id integer NULL;

ALTER TABLE t_p3896276_service_station_app.push_subscriptions
  DROP CONSTRAINT IF EXISTS push_subscriptions_master_id_endpoint_key;

CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_endpoint_idx
  ON t_p3896276_service_station_app.push_subscriptions (endpoint);
