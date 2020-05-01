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


//
//data "helm_repository" "codecentric" {
//  name = "codecentric"
//  url  = "https://codecentric.github.io/helm-charts"
//}

//resource "helm_release" "charles-keycloak" {
//  name       = "keycloak"
//  repository = "codecentric"
//  chart      = "codecentric/keycloak"
//  version    = "6.0.0"
//  namespace  = var.namespace
//
//  values = [data.template_file.charles-keycloak-extravars.rendered]
//
//  set {
//    name  = "keycloak.replicas"
//    value = "3"
//  }
//
//  depends_on = [
//    kubernetes_cluster_role_binding.tiller,
//    kubernetes_service_account.tiller,
//    aws_db_instance.db-keycloak,
//    helm_release.external-dns,
//  ]
//}