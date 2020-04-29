variable "db-moove-password" {
  default = ""
}
variable "db-moove-username" {
  default = ""
}
variable "db-notifications-password" {
  default = ""
}
variable "db-notifications-username" {
  default = ""
}

variable "db-villager-password" {
  default = ""
}
variable "db-villager-username" {
  default = ""
}
variable "db-deploy-password" {
  default = ""
}
variable "db-deploy-username" {
  default = ""
}
variable namespace {
  type = string
  default = "default"
}

data "template_file" "charles-postgresql-extravars" {
  template = file("${path.module}/charles-postgresql-extravars.tpl")
  vars = {
    postgres_password     = "firstpassword"
    db-notifications-password  = var.db-notifications-password
    db-notifications-username  = var.db-notifications-username
    db-moove-password = var.db-moove-password
    db-moove-username = var.db-moove-username
    db-villager-password = var.db-villager-password
    db-villager-username = var.db-villager-username
    db-deploy-password = var.db-deploy-password
    db-deploy-username = var.db-deploy-username
  }
}

resource "helm_release" "charles-postgresql" {
  name      = "charles-postgresql"
  chart     = "${path.module}/charts/postgresql"
  namespace = var.namespace

  values = [data.template_file.charles-postgresql-extravars.rendered]
}