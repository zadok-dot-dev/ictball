delete from venues where name like 'Placeholder Court%';

insert into venues (name, lat, lng, surface_type, indoor_outdoor, amenities)
values
  ('Eastview Park', 37.7126505, -97.2536851, 'grass', 'outdoor', array['goals', 'irrigated']),
  ('Edgemoor Park', 37.7010156, -97.2696188, 'grass', 'outdoor', array['goals', 'irrigated']),
  ('Kiwanis Park', 37.6872854, -97.4023896, 'grass', 'outdoor', array['goals']),
  ('Orchard Park', 37.7022152, -97.3994965, 'grass', 'outdoor', array['goals']),
  ('Redbud Park', 37.7198112, -97.2719222, 'grass', 'outdoor', array['goals', 'irrigated', '2 fields']),
  ('Schell Park', 37.7280660, -97.3483850, 'grass', 'outdoor', array['irrigated']),
  ('Sunset Park', 37.7170480, -97.4509963, 'grass', 'outdoor', array['goals', 'irrigated']),
  ('Fairmount Park (futsal court)', 37.7218834, -97.2929733, 'concrete', 'outdoor', array['restrooms', 'water fountain', 'parking']),
  ('North YMCA (Dennis Schoenebeck)', 37.7639107, -97.2624702, 'multi-purpose', 'outdoor', array['no lighting']),
  ('Heskett Center futsal (WSU)', 37.7193430, -97.2898878, 'hardcourt', 'indoor', array[]::text[]),
  ('WSU Eugene M. Hughes Metropolitan Complex', 37.7375360, -97.2782409, 'grass', 'outdoor', array[]::text[]);
