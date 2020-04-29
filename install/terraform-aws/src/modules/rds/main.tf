resource "random_password" "darwindeploy-password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "darwinvillager-password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "darwinapplication-password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "darwinnotifications-password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "db-keycloak" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "aws_db_subnet_group" "db-subnet-group" {
  name       = "db-subnet-group"
  subnet_ids = data.aws_subnet_ids.subnet-ids-private.ids

  lifecycle {
    ignore_changes = [
      "subnet_ids"
    ]
  }
}

resource "aws_db_instance" "db-keycloak" {
  identifier           = "keycloak"
  skip_final_snapshot  = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "9.6"
  instance_class       = "db.t2.small"
  multi_az             = false
  name                 = "keycloak"
  username             = "keycloak"
  password             = random_password.db-keycloak.result
  db_subnet_group_name = var.subnet_name
  vpc_security_group_ids = var.secutiry_group_ids
}

resource "aws_db_instance" "db-darwinapplication" {
  identifier           = "darwinapplication"
  skip_final_snapshot  = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "9.6"
  instance_class       = "db.t2.micro"
  multi_az             = false
  name                 = "darwinapplication"
  username             = "darwinapplication"
  password             = random_password.darwinapplication-password.result
  db_subnet_group_name = var.subnet_name
  vpc_security_group_ids = var.secutiry_group_ids
}

resource "aws_db_instance" "db-darwinvillager" {
  identifier           = "darwinvillager"
  skip_final_snapshot  = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "9.6"
  instance_class       = "db.t2.micro"
  multi_az             = false
  name                 = "darwinvillager"
  username             = "darwinvillager"
  password             = random_password.darwinvillager-password.result
  db_subnet_group_name = var.subnet_name
  vpc_security_group_ids = var.secutiry_group_ids
}

resource "aws_db_instance" "db-darwindeploy" {
  identifier           = "darwindeploy"
  skip_final_snapshot  = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "9.6"
  instance_class       = "db.t2.micro"
  multi_az             = false
  name                 = "darwindeploy"
  username             = "darwindeploy"
  password             = random_password.darwindeploy-password.result
  db_subnet_group_name = var.subnet_name
  vpc_security_group_ids = var.secutiry_group_ids
}

resource "aws_db_instance" "db-darwinnotifications" {
  identifier           = "darwinnotifications"
  skip_final_snapshot  = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "9.6"
  instance_class       = "db.t2.micro"
  multi_az             = false
  name                 = "darwinnotifications"
  username             = "darwinnotifications"
  password             = random_password.darwinnotifications-password.result
  db_subnet_group_name = var.subnet_name
  vpc_security_group_ids = var.secutiry_group_ids
}