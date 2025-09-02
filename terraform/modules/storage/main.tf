resource "google_storage_bucket" "bucket" {
  name          = "${var.bucket_name}-${var.env}"
  location      = var.gcp_region
  force_destroy = false # Set to true to allow deleting a non-empty bucket

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# CDN is implicitly enabled for public GCS buckets.
# For more advanced CDN capabilities, a dedicated Cloud CDN resource connected
# to a load balancer would be necessary. This configuration provides basic CDN-like
# caching for publicly accessible objects.
