variable "gcp_project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for Firestore. This should match the App Engine location."
  type        = string
}
