CREATE TABLE t_p3896276_service_station_app.reviews (
    id SERIAL PRIMARY KEY,
    master_id INT NOT NULL REFERENCES t_p3896276_service_station_app.masters(id),
    client_id INT NOT NULL REFERENCES t_p3896276_service_station_app.users(id),
    request_id INT REFERENCES t_p3896276_service_station_app.requests(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX reviews_request_client_uniq
    ON t_p3896276_service_station_app.reviews(request_id, client_id)
    WHERE request_id IS NOT NULL;