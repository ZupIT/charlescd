module "rds" {
  source = "./modules/rds"

  secutiry_group_ids = ""
  // [aws_security_group.postgres-rds-databases.id]
  subnet_name = ""
  // aws_db_subnet_group.db-subnet-group.name
}

module "elasticache" {
  source = "./modules/elasticache"

  subnet_ids = ""
  secutiry_group_ids = ""
}

module "keycloak" {
  source = "./modules/keycloak"

  db_keycloak_username = module.rds.aws_db_instance.db-keycloak.username
  db_keycloak_password = module.rds.aws_db_instance.db-keycloak.password
  db_keycloak_database = module.rds.aws_db_instance.db-keycloak.database
  db_keycloak_host = module.rds.aws_db_instance.db-keycloak.adress
  dns_name = ""
  //aws_route53_zone.dns.name
  domain-name = ""
  subnet_public_ids = ""
  // join(", ", data.aws_subnet_ids.subnet-ids-public.ids)
  charles-namespace = ""
}