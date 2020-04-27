data "template_file" "charles-keycloak-extravars" {
  template = file("${path.module}/keycloak-extravars.tpl")
  vars = {
    keycloak_password     = "firstpassword"
  }
}

variable namespace {
  type = string
  default = "default"
}

resource "helm_release" "charles-keycloak" {
  name      = "charles-keycloak"
  chart     = "${path.module}/charts/keycloak"
  namespace = var.namespace

  values = [data.template_file.charles-keycloak-extravars.rendered]
}