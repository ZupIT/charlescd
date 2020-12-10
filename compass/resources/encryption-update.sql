update data_sources
set data = PGP_SYM_ENCRYPT(deprecated_data::text, :privateKey)
where data_sources.data IS NULL
  AND data_sources.deprecated_data IS NOT NULL;

update actions
set configuration = PGP_SYM_ENCRYPT(deprecated_configuration::text, :privateKey)
where actions.configuration IS NULL
  AND actions.deprecated_configuration IS NOT NULL;