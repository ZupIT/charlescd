resource "helm_release" "charles-notifications" {
  name      = "charles-notifications"
  chart     = "${path.module}/charts/darwin-notifications"
  namespace = var.namespace

  values = [data.template_file.charles-notifications-extravars.rendered]
}

resource "helm_release" "charles-moove" {
  name      = "charles-moove"
  chart     = "${path.module}/charts/darwin-application"
  namespace = var.namespace

  values = [data.template_file.charles-moove-extravars.rendered]
}

resource "helm_release" "charles-circle-matcher" {
  name      = "charles-circle-matcher"
  chart     = "${path.module}/charts/darwin-circle-matcher"
  namespace = var.namespace
}
