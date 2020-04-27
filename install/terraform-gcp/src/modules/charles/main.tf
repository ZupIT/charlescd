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
