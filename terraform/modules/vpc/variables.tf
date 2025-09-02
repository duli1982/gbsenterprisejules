variable "network_name" {
  description = "The name of the VPC network."
  type        = string
  default     = "main-vpc"
}

variable "subnetwork_name" {
  description = "The name of the subnetwork."
  type        = string
  default     = "main-subnet"
}

variable "subnetwork_cidr" {
  description = "The CIDR block for the subnetwork."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region."
  type        = string
}

variable "env" {
  description = "The environment (e.g., dev, staging, prod)."
  type        = string
}
