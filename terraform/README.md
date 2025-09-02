# Terraform Infrastructure for a Web Application

This directory contains the Terraform code to provision and manage the Google Cloud Platform (GCP) infrastructure for a standard web application. It sets up networking, storage for static assets, and a Firestore database.

## Prerequisites

Before you can use this Terraform code, you must have the following set up:

1.  **Terraform**: [Install Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) (version >= 1.0).
2.  **Google Cloud SDK**: [Install the gcloud CLI](https://cloud.google.com/sdk/docs/install) and authenticate:
    ```sh
    gcloud auth application-default login
    ```
3.  **GCP Projects**: A separate GCP project for each environment (e.g., dev, staging, prod).
4.  **Billing**: Billing must be enabled on each of your GCP projects.
5.  **APIs**: The following APIs must be enabled in each GCP project. You can enable them with `gcloud services enable [API_NAME]`:
    *   Compute Engine API (`compute.googleapis.com`)
    *   Cloud Storage API (`storage-component.googleapis.com`)
    *   App Engine Admin API (`appengine.googleapis.com`)
    *   Cloud Firestore API (`firestore.googleapis.com`)
6.  **Terraform State Bucket**: A GCS bucket to store the Terraform state remotely. You must create this bucket manually before running Terraform.

## Directory Structure

*   `main.tf`: The root configuration that instantiates the modules.
*   `variables.tf`: Definitions for variables used in the root configuration.
*   `outputs.tf`: Outputs from the root configuration.
*   `modules/`: Reusable Terraform modules for each part of the infrastructure.
    *   `vpc/`: Manages the VPC network, subnets, and firewall rules.
    *   `storage/`: Manages the GCS bucket for static website assets.
    *   `firestore/`: Manages the Cloud Firestore database.
*   `environments/`: Environment-specific variable files (`.tfvars`).
    *   `dev.tfvars`: Variables for the development environment.
    *   `staging.tfvars`: Variables for the staging environment.
    *   `prod.tfvars`: Variables for the production environment.

## How to Use

1.  **Configure Backend**: In `terraform/main.tf`, find the `backend "gcs"` block and replace `"your-terraform-state-bucket"` with the name of the GCS bucket you created for Terraform state.

2.  **Configure Environment Variables**: In the `terraform/environments/` directory, update the `.tfvars` files with your actual GCP project IDs for each environment.

3.  **Initialize Terraform**: Navigate to the `terraform` directory and run `terraform init`. This downloads the necessary providers and configures the backend.
    ```sh
    cd terraform
    terraform init
    ```

4.  **Plan and Apply**: To deploy an environment, run `terraform plan` and `terraform apply`, specifying the appropriate environment variable file.

    **Example for the 'dev' environment:**
    ```sh
    # See what changes will be made
    terraform plan -var-file="environments/dev.tfvars"

    # Apply the changes
    terraform apply -var-file="environments/dev.tfvars"
    ```
    To deploy another environment, simply change the `-var-file` path (e.g., to `environments/staging.tfvars`).

## Firestore Security Rules

The `terraform/modules/firestore/firestore.rules` file contains the security rules for your database. Terraform does not deploy these rules directly. You should deploy them using the Firebase CLI.

1.  **Install Firebase CLI**: `npm install -g firebase-tools`
2.  **Configure `firebase.json`**: Create a `firebase.json` file in the repository root:
    ```json
    {
      "firestore": {
        "rules": "terraform/modules/firestore/firestore.rules"
      }
    }
    ```
3.  **Deploy Rules**: Run the following command, making sure to target the correct GCP project:
    ```sh
    firebase deploy --only firestore:rules --project your-gcp-project-id-dev
    ```
