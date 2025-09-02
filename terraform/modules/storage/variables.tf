variable "bucket_name" {
  description = "The name of the Cloud Storage bucket."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for the bucket."
  type        = string
}

variable "env" {
  description = "The environment (e.g., dev, staging, prod)."
  type        = string
}
