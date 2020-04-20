resource "google_compute_network" "default" {
  name                    = var.network_name
  auto_create_subnetworks = false
}

data "google_client_config" "current" {}

resource "google_compute_subnetwork" "default" {
  name                     = var.network_name
  ip_cidr_range            = "10.127.0.0/20"
  network                  = google_compute_network.default.self_link
  region                   = var.region
  private_ip_google_access = true
}

data "google_container_engine_versions" "default" {
  location = var.zone
}

resource "google_container_cluster" "default" {
  name               = "tf-charless"
  location           = var.zone
  initial_node_count = 1
  min_master_version = data.google_container_engine_versions.default.latest_master_version
  network            = google_compute_subnetwork.default.name
  subnetwork         = google_compute_subnetwork.default.name

  provider = google-beta

  addons_config {
    istio_config {
      disabled = false
      auth     = "AUTH_MUTUAL_TLS"
    }
  }

  node_config {
    preemptible  = true
    machine_type = "n1-standard-1"

    metadata = {
      disable-legacy-endpoints = "true"
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

output "network" {
  value = google_compute_subnetwork.default.network
}

output "subnetwork_name" {
  value = google_compute_subnetwork.default.name
}

output "cluster_name" {
  value = google_container_cluster.default.name
}

output "cluster_region" {
  value = var.region
}

output "cluster_zone" {
  value = google_container_cluster.default.zone
}