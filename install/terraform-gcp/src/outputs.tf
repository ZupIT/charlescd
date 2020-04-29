output "cluster_name" {
  value = google_container_cluster.default.name
}

output "cluster_region" {
  value = var.region
}

output "cluster_zone" {
  value = google_container_cluster.default.zone
}