data "helm_repository" "stable" {
  name = "stable"
  url  = "https://kubernetes-charts.storage.googleapis.com"
}

resource "helm_release" "spinnaker" {
  name       = "spinnaker"
  repository = "stable"
  chart      = "stable/spinnaker"
  version    = "1.20.2"
  namespace  = "spinnaker"

  timeout = "600"
  values  = [data.template_file.spinnaker-extravars.rendered]
}

resource "google_storage_bucket" "spinnaker" {
  name          = "charles-spinnaker-gcp"
  location      = var.location
  force_destroy = true

}


data "template_file" "spinnaker-extravars" {
  template = file("${path.module}/spinnaker-extravars.tpl")
  vars = {
    bucket             = google_storage_bucket.spinnaker.url
    region             = var.location
    redis_host         = var.redis_host
    redis_port         = var.redis_port
    redis_pass         = var.redis_pass
    tyk-address-spinnakerdeck = "charles-spinnaker.${var.domain-name}"
    tyk-address-spinnakergate = "charles-spinnaker-gate.${var.domain-name}"
    token-github = "becd4b7a621d95328bcdc2b4f82dbc2bd1a1d7c7"
  }
}