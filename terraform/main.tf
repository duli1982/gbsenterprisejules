terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0"
    }
  }

  backend "gcs" {
    bucket = "your-terraform-state-bucket" # IMPORTANT: Replace with your actual GCS bucket name for Terraform state
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Networking Module
# This module creates the VPC, subnets, and firewall rules.
module "vpc" {
  source          = "./modules/vpc"
  network_name    = "main-vpc"
  subnetwork_name = "main-subnet"
  subnetwork_cidr = var.subnetwork_cidr
  gcp_region      = var.gcp_region
  env             = var.env
}

# Storage Module
# This module creates the GCS bucket for the application's static assets.
module "storage" {
  source      = "./modules/storage"
  bucket_name = var.bucket_name
  gcp_region  = var.gcp_region
  env         = var.env
}

# Firestore Module
# This module sets up the Cloud Firestore database.
module "firestore" {
  source         = "./modules/firestore"
  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
}
