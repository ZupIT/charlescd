provider "google" {
  # ... other configuration ...
  region  = "us-central1"
  version = "~> 3.0.0-beta.1"
}

provider "google-beta" {
  # ... other configuration ...
  region  = "us-central1"
  version = "~> 3.0.0-beta.1"
}

provider "helm" {
  kubernetes {
    host                   = google_container_cluster.default.endpoint
    token                  = data.google_client_config.current.access_token
    client_certificate     = base64decode(google_container_cluster.default.master_auth.0.client_certificate)
    client_key             = base64decode(google_container_cluster.default.master_auth.0.client_key)
    cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth.0.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  host                   = google_container_cluster.default.endpoint
  cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth.0.cluster_ca_certificate)
  token                  = data.google_client_config.current.access_token
  load_config_file       = false
}