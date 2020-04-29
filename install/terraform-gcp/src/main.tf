data "google_client_config" "current" {}

data "google_container_engine_versions" "default" {
  location = var.zone
}

resource "google_container_cluster" "default" {
  name               = "charlescd"
  location           = var.zone
  initial_node_count = 1
  min_master_version = data.google_container_engine_versions.default.latest_master_version
  node_locations = [
    "us-central1-c",
    "us-central1-f",
    "us-central1-b"
  ]
  node_config {
    machine_type = "n1-standard-2"
    disk_size_gb = 20
  }


  provider = google-beta

  addons_config {
    istio_config {
      disabled = false
      auth     = "AUTH_NONE"
    }
  }

  // Wait for the GCE LB controller to cleanup the resources.
  provisioner "local-exec" {
    when    = destroy
    command = "sleep 90"
  }
}

resource "kubernetes_namespace" "charles" {
  metadata {

    labels = {
      istio-injection = "enabled"
    }

    name = "charles"
  }
}

resource "random_password" "charlesnotifications_password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "charlesmoove_password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "charlesvillager_password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "charlesdeploy_password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

module "keycloak" {
  source = "./modules/keycloak"

  namespace = kubernetes_namespace.charles.metadata[0].name
}

module "postgresql" {
  source = "./modules/postgresql"

  namespace = kubernetes_namespace.charles.metadata[0].name
  db-notifications-username = "charlesnotifications"
  db-notifications-password = random_password.charlesnotifications_password.result
  db-moove-username = "charlesmoove"
  db-moove-password = random_password.charlesnotifications_password.result
  db-villager-username = "charlescirclematcher"
  db-villager-password = random_password.charlesvillager_password.result
  db-deploy-username = "charlesdeploy"
  db-deploy-password = random_password.charlesdeploy_password.result
}

module "charles" {
  source = "./modules/charles"

  namespace = kubernetes_namespace.charles.metadata[0].name
  db-notifications-username = "charlesnotifications"
  db-notifications-password = random_password.charlesnotifications_password.result
  db-moove-username = "charlesmoove"
  db-moove-password = random_password.charlesnotifications_password.result
//  db-villager-username = "charlescirclematcher"
//  db-circle-matcher-password = random_password.charlescirclematcher_password
//  db-deploy-username = "charlesdeploy"
//  db-deploy-password = random_password.charlesdeploy_password
}

module "redis" {
  source = "./modules/redis"

  namespace = kubernetes_namespace.charles.metadata[0].name
}

module "tyk" {
  source = "./modules/tyk"

  namespace = kubernetes_namespace.charles.metadata[0].name
}
