# Firestore in Native Mode requires an App Engine application to exist in the project.
# This resource provisions one. The location of the App Engine app also determines
# the location of the Firestore database.
resource "google_app_engine_application" "app" {
  project     = var.gcp_project_id
  location_id = var.gcp_region
  database_type = "CLOUD_FIRESTORE"
}

# This resource creates the Firestore database itself.
resource "google_firestore_database" "database" {
  project     = var.gcp_project_id
  name        = "(default)" # Firestore typically has a single (default) database per project
  location_id = var.gcp_region
  type        = "FIRESTORE_NATIVE"

  # This ensures the App Engine application is created before the database.
  depends_on = [google_app_engine_application.app]
}
