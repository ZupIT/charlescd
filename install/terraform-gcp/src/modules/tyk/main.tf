variable "namespace" {
  default = ""
}
resource "helm_release" "charles-tyk" {
  name      = "charles-tyk"
  chart     = "${path.module}/charts/tyk-darwin"
  namespace = var.namespace

  values = [data.template_file.charles-tyk-extravars.rendered]
}

data "template_file" "charles-tyk-extravars" {
  template = file("${path.module}/tyk-darwin-extravars.tpl")
}

//resource "kubectl_manifest" "charles-tyk" {
//    yaml_body = file("${path.module}/tyk.yaml")
//}