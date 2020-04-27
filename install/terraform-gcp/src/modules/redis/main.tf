variable "namespace" {
  default = ""
}
resource "helm_release" "charles-redis" {
  name      = "charles-redis"
  chart     = "${path.module}/chart/redis"
  namespace = var.namespace
}