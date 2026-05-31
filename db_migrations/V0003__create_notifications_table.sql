CREATE TABLE t_p3896276_service_station_app.notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INT,
  master_id   INT REFERENCES t_p3896276_service_station_app.masters(id),
  type        TEXT NOT NULL,  -- 'personal_request' | 'bid_accepted' | 'status' | 'message' | 'promo' | 'review'
  title       TEXT NOT NULL,
  text        TEXT NOT NULL,
  request_id  INT REFERENCES t_p3896276_service_station_app.requests(id),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);