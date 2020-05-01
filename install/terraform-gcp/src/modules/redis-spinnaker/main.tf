variable "namespace" {
  default = ""
}
resource "helm_release" "charles-redis-spinnaker" {
  name      = "charles-redis-spinnaker"
  chart     = "${path.module}/chart/redis"
  namespace = var.namespace
}