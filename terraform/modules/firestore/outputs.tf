output "database_name" {
  description = "The name of the Firestore database."
  value       = google_firestore_database.database.name
}

output "app_engine_application_id" {
  description = "The ID of the App Engine application."
  value       = google_app_engine_application.app.id
}
