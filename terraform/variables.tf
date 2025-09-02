variable "gcp_project_id" {
  description = "The GCP project ID to deploy resources into."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region to deploy resources into."
  type        = string
  default     = "us-central1"
}

variable "env" {
  description = "The environment name (e.g., dev, staging, prod)."
  type        = string
}

variable "subnetwork_cidr" {
  description = "The CIDR block for the VPC subnetwork."
  type        = string
}

variable "bucket_name" {
  description = "The base name for the Cloud Storage bucket."
  type        = string
}
