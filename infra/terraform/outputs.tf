output "vpc_id" {
  description = "VPC identifier."
  value       = module.vpc.vpc_id
}

output "aws_region" {
  description = "AWS region used by this stack."
  value       = var.aws_region
}

output "expected_aws_account_id" {
  description = "AWS account ID allowed by the provider guard."
  value       = var.expected_aws_account_id
}

output "public_subnet_ids" {
  description = "Public subnet identifiers."
  value       = module.vpc.public_subnets
}

output "private_subnet_ids" {
  description = "Private subnet identifiers."
  value       = module.vpc.private_subnets
}

output "api_ecr_repository_url" {
  description = "ECR URL for the API image."
  value       = aws_ecr_repository.api.repository_url
}

output "media_bucket_name" {
  description = "S3 bucket used for instance media."
  value       = aws_s3_bucket.media.bucket
}

output "media_cloudfront_distribution_id" {
  description = "CloudFront distribution ID for media files."
  value       = aws_cloudfront_distribution.media.id
}

output "media_cloudfront_domain_name" {
  description = "CloudFront domain for media files."
  value       = aws_cloudfront_distribution.media.domain_name
}

output "media_public_base_url" {
  description = "Public base URL used by the API for uploaded media."
  value       = local.media_public_base_url
}

output "api_log_group_name" {
  description = "CloudWatch log group for API tasks."
  value       = aws_cloudwatch_log_group.api.name
}

output "api_alb_dns_name" {
  description = "ALB DNS name for API ingress."
  value       = aws_lb.api.dns_name
}

output "api_target_group_arn" {
  description = "Target group ARN for API service."
  value       = aws_lb_target_group.api.arn
}

output "api_ecs_cluster_name" {
  description = "ECS cluster name for API service."
  value       = aws_ecs_cluster.api.name
}

output "api_ecs_service_name" {
  description = "ECS service name for API."
  value       = aws_ecs_service.api.name
}

output "api_task_definition_arn" {
  description = "Task definition ARN currently used by API service."
  value       = aws_ecs_task_definition.api.arn
}

output "api_config_secret_arn" {
  description = "Secrets Manager ARN containing API sensitive settings."
  value       = aws_secretsmanager_secret.api.arn
}

output "rds_endpoint" {
  description = "RDS endpoint for PostgreSQL."
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "RDS PostgreSQL port."
  value       = aws_db_instance.postgres.port
}

output "dynamodb_table_name" {
  description = "DynamoDB table name used by application data."
  value       = aws_dynamodb_table.app.name
}

output "web_bucket_name" {
  description = "S3 bucket used for web static assets."
  value       = aws_s3_bucket.web.bucket
}

output "web_cloudfront_domain_name" {
  description = "CloudFront domain for web distribution."
  value       = aws_cloudfront_distribution.web.domain_name
}

output "web_cloudfront_distribution_id" {
  description = "CloudFront distribution ID for web assets."
  value       = aws_cloudfront_distribution.web.id
}

output "generated_admin_password" {
  description = "Generated bootstrap admin password when admin_password is not provided."
  value       = local.resolved_admin_password
  sensitive   = true
}

output "generated_postgres_password" {
  description = "Generated PostgreSQL password when postgres_password is not provided."
  value       = local.resolved_postgres_password
  sensitive   = true
}

output "generated_jwt_secret" {
  description = "Generated JWT secret when jwt_secret is not provided."
  value       = local.resolved_jwt_secret
  sensitive   = true
}

output "alb_security_group_id" {
  description = "Security group for the public load balancer."
  value       = aws_security_group.alb.id
}

output "api_security_group_id" {
  description = "Security group for API tasks."
  value       = aws_security_group.api.id
}

output "rds_security_group_id" {
  description = "Security group for PostgreSQL."
  value       = aws_security_group.rds.id
}
