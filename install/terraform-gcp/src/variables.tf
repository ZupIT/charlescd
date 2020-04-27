variable "region" {
  type = string
  default = "us-central1"
}

variable "zone" {
  type = string
  default = "us-central1"
}

variable "network_name" {
  type = string
  default = "charles-cd"
}

variable "helm_version" {
  default = "v3.1.1"
}
variable "acme_email" {
  default = "lucas.sales@zup.com.br"
}

variable "app_name" {
  default = "charles"
}

variable "namespace" {
  default = "charles"
}

