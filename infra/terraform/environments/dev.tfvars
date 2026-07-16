aws_region              = "us-east-1"
aws_profile             = null
expected_aws_account_id = "000000000000"

project_name = null
environment  = "dev"
system_name  = null

vpc_cidr             = "10.20.0.0/16"
availability_zones   = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs  = ["10.20.0.0/24", "10.20.1.0/24"]
private_subnet_cidrs = ["10.20.10.0/24", "10.20.11.0/24"]

api_image_tag           = "latest"
api_desired_count       = 1
api_acm_certificate_arn = null
api_domain_name         = null

web_domain_name          = null
web_acm_certificate_arn  = null
web_bucket_force_destroy = true

media_domain_name          = null
media_acm_certificate_arn  = null
media_bucket_force_destroy = true

postgres_instance_class        = "db.t4g.micro"
postgres_backup_retention_days = 1
postgres_multi_az              = false
postgres_deletion_protection   = false
postgres_skip_final_snapshot   = true

postgres_db   = "base_system"
postgres_user = "base_system"

admin_email = "admin@base.local"
admin_name  = "Back Office Admin"

cors_origin = "https://app.example.com"

tags = {
  Owner = "platform"
}
