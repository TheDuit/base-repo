locals {
  resolved_postgres_password = var.postgres_password != null ? var.postgres_password : random_password.postgres[0].result
  resolved_jwt_secret        = var.jwt_secret != null ? var.jwt_secret : random_password.jwt[0].result
  resolved_admin_password    = var.admin_password != null ? var.admin_password : random_password.admin[0].result
}

resource "random_password" "postgres" {
  count   = var.postgres_password == null ? 1 : 0
  length  = 24
  special = false
}

resource "random_password" "jwt" {
  count   = var.jwt_secret == null ? 1 : 0
  length  = 48
  special = false
}

resource "random_password" "admin" {
  count   = var.admin_password == null ? 1 : 0
  length  = 20
  special = false
}

resource "aws_db_subnet_group" "postgres" {
  name       = "${local.rds_identifier}-subnets"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_db_instance" "postgres" {
  identifier                 = local.rds_identifier
  engine                     = "postgres"
  engine_version             = "16.4"
  instance_class             = var.postgres_instance_class
  allocated_storage          = var.postgres_allocated_storage
  max_allocated_storage      = var.postgres_max_allocated_storage
  storage_encrypted          = true
  backup_retention_period    = var.postgres_backup_retention_days
  multi_az                   = var.postgres_multi_az
  db_subnet_group_name       = aws_db_subnet_group.postgres.name
  vpc_security_group_ids     = [aws_security_group.rds.id]
  username                   = var.postgres_user
  password                   = local.resolved_postgres_password
  db_name                    = var.postgres_db
  port                       = 5432
  publicly_accessible        = false
  auto_minor_version_upgrade = true
  apply_immediately          = true
  skip_final_snapshot        = var.postgres_skip_final_snapshot
  deletion_protection        = var.postgres_deletion_protection
}

resource "aws_dynamodb_table" "app" {
  name         = local.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

resource "aws_secretsmanager_secret" "api" {
  name = "${local.name_prefix}/api/config"
}

resource "aws_secretsmanager_secret_version" "api" {
  secret_id = aws_secretsmanager_secret.api.id
  secret_string = jsonencode({
    POSTGRES_PASSWORD = local.resolved_postgres_password
    JWT_SECRET        = local.resolved_jwt_secret
    ADMIN_PASSWORD    = local.resolved_admin_password
  })
}
