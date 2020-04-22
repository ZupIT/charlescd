//resource "google_compute_address" "default" {
//  name   = "tf-gke-helm-${var.app_name}"
//  region = "${var.region}"
//}

//data "template_file" "openapi_spec" {
//  template = "${file("${path.module}/openapi_spec.yaml")}"
//
//  vars {
//    endpoint_service = "${var.app_name}-${random_id.endpoint-name.hex}.endpoints.${data.google_client_config.current.project}.cloud.goog"
//    target           = "${google_compute_address.default.address}"
//  }
//}

//resource "random_id" "endpoint-name" {
//  byte_length = 2
//}

//resource "google_endpoints_service" "openapi_service" {
//  service_name   = "${var.app_name}-${random_id.endpoint-name.hex}.endpoints.${data.google_client_config.current.project}.cloud.goog"
//  project        = "${data.google_client_config.current.project}"
//  openapi_config = "${data.template_file.openapi_spec.rendered}"
//}

resource "helm_release" "charles-postgresql" {
  name      = "charles-postgresql"
  chart     = "${path.module}/charts/postgresql"
  namespace = var.namespace

  values = [data.template_file.charles-postgresql-extravars.rendered]

  depends_on = [
    kubernetes_namespace.charles
  ]
}

//resource "helm_release" "charles-notifications" {
//  name      = "charles-postgresql"
//  chart     = "${path.module}/charts/charles-notification"
//  namespace = var.namespace
//
//  values = [data.template_file.charles-postgresql-extravars.rendered]
//
//  depends_on = [
//    kubernetes_namespace.charles
//  ]
//}

//resource "helm_release" "kube-lego" {
//  name  = "kube-lego"
//  chart = "stable/kube-lego"
//
//  values = [<<EOF
//rbac:
//  create: false
//config:
//  LEGO_EMAIL: ${var.acme_email}
//  LEGO_URL: ${var.acme_url}
//  LEGO_SECRET_NAME: lego-acme
//EOF
//  ]
//}

//resource "helm_release" "nginx-ingress" {
//  name  = "nginx-ingress"
//  chart = "stable/nginx-ingress"
//
//  values = [<<EOF
//rbac:
//  create: false
//controller:
//  service:
//    loadBalancerIP: ${google_compute_address.default.address}
//EOF
//  ]
//
//  depends_on = [
//    "helm_release.kube-lego",
//  ]
//}

//resource "random_id" "drupal_password" {
//  byte_length = 8
//}

//resource "helm_release" "drupal" {
//  name  = "drupal"
//  chart = "stable/drupal"
//
//  values = [<<EOF
//drupalUsername: user
//drupalPassword: ${random_id.drupal_password.b64_std}
//serviceType: ClusterIP
//ingress:
//  enabled: true
//  hostname: ${google_endpoints_service.openapi_service.service_name}
//  tls:
//  - hosts:
//    - ${google_endpoints_service.openapi_service.service_name}
//    secretName: drupal-tls
//  annotations:
//    kubernetes.io/ingress.class: nginx
//    kubernetes.io/tls-acme: "true"
//    ingress.kubernetes.io/ssl-redirect: "true"
//EOF
//  ]
//
//  depends_on = [
//    "helm_release.kube-lego",
//    "helm_release.nginx-ingress",
//    "google_container_cluster.default",
//  ]
//}

//output "endpoint" {
//  value = "https://${google_endpoints_service.openapi_service.service_name}"
//}
//
//output "drupal_user" {
//  value = "user"
//}
//
//output "drupal_password" {
//  value = "${random_id.drupal_password.b64_std}"
//}
