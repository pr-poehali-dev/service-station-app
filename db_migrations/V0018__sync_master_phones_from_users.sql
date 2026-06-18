UPDATE t_p3896276_service_station_app.masters m
SET phone = u.phone
FROM t_p3896276_service_station_app.users u
WHERE u.master_id = m.id AND u.phone IS NOT NULL;