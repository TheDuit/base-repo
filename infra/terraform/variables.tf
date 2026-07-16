variable "aws_region" {
  description = "AWS region for the environment."
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "Optional named AWS CLI profile used by Terraform for local runs. Leave null in CI to use environment credentials."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition     = var.aws_profile == null || length(trimspace(var.aws_profile)) > 0
    error_message = "aws_profile must be null or a non-empty named AWS CLI profile."
  }
}

variable "expected_aws_account_id" {
  description = "AWS account ID that Terraform is allowed to manage."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.expected_aws_account_id))
    error_message = "expected_aws_account_id must be a 12-digit AWS account ID."
  }
}

variable "project_name" {
  description = "Optional project identifier used in resource names. If null, Terraform uses system.manifest.json aws.projectName."
  type        = string
  default     = null
  nullable    = true
}

variable "environment" {
  description = "Environment name, such as dev, staging or prod."
  type        = string
  default     = "dev"
}

variable "system_name" {
  description = "Optional system name used by the instance. If null, Terraform uses system.manifest.json systemName."
  type        = string
  default     = null
  nullable    = true
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.20.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones used by the environment."
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets."
  type        = list(string)
}

variable "media_bucket_force_destroy" {
  description = "Allow automatic bucket deletion in non-production environments."
  type        = bool
  default     = false
}

variable "web_bucket_force_destroy" {
  description = "Allow automatic deletion of web bucket in non-production environments."
  type        = bool
  default     = false
}

variable "api_log_retention_days" {
  description = "CloudWatch retention for API logs."
  type        = number
  default     = 30
}

variable "api_container_port" {
  description = "Container port exposed by the API service."
  type        = number
  default     = 4000
}

variable "api_image_tag" {
  description = "Docker tag used for the API image in ECR."
  type        = string
  default     = "latest"
}

variable "api_cpu" {
  description = "CPU units for ECS task definition."
  type        = number
  default     = 512
}

variable "api_memory" {
  description = "Memory (MiB) for ECS task definition."
  type        = number
  default     = 1024
}

variable "api_desired_count" {
  description = "Desired number of ECS tasks for API service."
  type        = number
  default     = 1
}

variable "api_health_check_path" {
  description = "Health check path used by ALB target group."
  type        = string
  default     = "/api/health"
}

variable "api_acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener on ALB. If null, only HTTP is created."
  type        = string
  default     = null
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for optional DNS records."
  type        = string
  default     = null
}

variable "api_domain_name" {
  description = "Optional domain for API ALB alias record."
  type        = string
  default     = null
}

variable "web_domain_name" {
  description = "Optional domain for CloudFront alias record."
  type        = string
  default     = null
}

variable "web_acm_certificate_arn" {
  description = "ACM certificate ARN in us-east-1 for CloudFront custom domain."
  type        = string
  default     = null
}

variable "web_price_class" {
  description = "CloudFront price class for web distribution."
  type        = string
  default     = "PriceClass_100"
}

variable "media_domain_name" {
  description = "Optional domain for media CloudFront alias record."
  type        = string
  default     = null
}

variable "media_acm_certificate_arn" {
  description = "ACM certificate ARN in us-east-1 for the media CloudFront custom domain."
  type        = string
  default     = null
}

variable "media_price_class" {
  description = "CloudFront price class for media distribution."
  type        = string
  default     = "PriceClass_100"
}

variable "postgres_db" {
  description = "PostgreSQL database name."
  type        = string
  default     = "base_system"
}

variable "postgres_user" {
  description = "PostgreSQL username."
  type        = string
  default     = "base_system"
}

variable "postgres_password" {
  description = "Optional PostgreSQL password. If null, Terraform generates one."
  type        = string
  default     = null
  sensitive   = true
}

variable "postgres_instance_class" {
  description = "RDS instance class for PostgreSQL."
  type        = string
  default     = "db.t4g.micro"
}

variable "postgres_allocated_storage" {
  description = "RDS allocated storage in GiB."
  type        = number
  default     = 20
}

variable "postgres_max_allocated_storage" {
  description = "RDS max autoscaled storage in GiB."
  type        = number
  default     = 100
}

variable "postgres_backup_retention_days" {
  description = "RDS backup retention period in days."
  type        = number
  default     = 1
}

variable "postgres_multi_az" {
  description = "Enable Multi-AZ for RDS PostgreSQL."
  type        = bool
  default     = false
}

variable "postgres_deletion_protection" {
  description = "Enable deletion protection for RDS PostgreSQL."
  type        = bool
  default     = false
}

variable "postgres_skip_final_snapshot" {
  description = "Skip the final snapshot when destroying RDS PostgreSQL. Keep true only for disposable environments."
  type        = bool
  default     = true
}

variable "jwt_secret" {
  description = "Optional JWT secret. If null, Terraform generates one."
  type        = string
  default     = null
  sensitive   = true
}

variable "jwt_expires_in_seconds" {
  description = "JWT expiration in seconds."
  type        = number
  default     = 3600
}

variable "admin_email" {
  description = "Bootstrap back office admin email."
  type        = string
  default     = "admin@base.local"
}

variable "admin_name" {
  description = "Bootstrap back office admin display name."
  type        = string
  default     = "Back Office Admin"
}

variable "admin_password" {
  description = "Optional bootstrap admin password. If null, Terraform generates one."
  type        = string
  default     = null
  sensitive   = true
}

variable "admin_bootstrap_on_startup" {
  description = "Run admin bootstrap at API startup."
  type        = bool
  default     = true
}

variable "cors_origin" {
  description = "CORS origin used by API."
  type        = string
  default     = "http://localhost:3000"
}

variable "tags" {
  description = "Additional tags applied to resources."
  type        = map(string)
  default     = {}
}
