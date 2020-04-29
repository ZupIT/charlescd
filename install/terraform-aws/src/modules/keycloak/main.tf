resource "aws_acm_certificate" "charles-keycloak" {
  domain_name       = "darwin-keycloak.${var.dns_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}


data "template_file" "keycloak-extravars" {
  template = file("${path.module}/templates/keycloak-extravars.tpl")
  vars = {
    postgres_user         = var.db_keycloak_username
    postgres_password     = var.db_keycloak_password
    postgres_database     = var.db_keycloak_database
    postgres_database_url = var.db_keycloak_host
    certificate-arn-darwin-keycloak = aws_acm_certificate.charles-keycloak.arn
    address-keycloak = "charles-keycloak.${var.domain-name}"
    subnets         = join(", ", var.subnet_public_ids)
  }
}


data "helm_repository" "codecentric" {
  name = "codecentric"
  url  = "https://codecentric.github.io/helm-charts"
}

resource "helm_release" "keycloak" {
  name       = "keycloak"
  repository = "codecentric"
  chart      = "codecentric/keycloak"
  version    = "6.0.0"
  namespace  = var.charles-namespace

  values = [data.template_file.keycloak-extravars.rendered]

  set {
    name  = "keycloak.replicas"
    value = "3"
  }
}