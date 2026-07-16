resource "aws_lb" "api" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "api" {
  name        = "${local.name_prefix}-api"
  port        = var.api_container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.vpc.vpc_id

  health_check {
    enabled             = true
    path                = var.api_health_check_path
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200-399"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
  }
}

resource "aws_lb_listener" "api_http_forward" {
  count = var.api_acm_certificate_arn == null ? 1 : 0

  load_balancer_arn = aws_lb.api.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_lb_listener" "api_http_redirect" {
  count = var.api_acm_certificate_arn != null ? 1 : 0

  load_balancer_arn = aws_lb.api.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "api_https" {
  count = var.api_acm_certificate_arn != null ? 1 : 0

  load_balancer_arn = aws_lb.api.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.api_acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_ecs_cluster" "api" {
  name = "${local.api_name}-cluster"
}

resource "aws_ecs_task_definition" "api" {
  family                   = local.api_name
  cpu                      = tostring(var.api_cpu)
  memory                   = tostring(var.api_memory)
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = "${aws_ecr_repository.api.repository_url}:${var.api_image_tag}"
      essential = true

      portMappings = [
        {
          containerPort = var.api_container_port
          protocol      = "tcp"
        }
      ]

      command = [
        "sh",
        "-c",
        "npm run migration:run -w apps/api && node apps/api/dist/main.js"
      ]

      environment = [
        { name = "APP_ENV", value = "production" },
        { name = "SYSTEM_MANIFEST_PATH", value = "/app/system.manifest.json" },
        { name = "PORT", value = tostring(var.api_container_port) },
        { name = "JWT_EXPIRES_IN_SECONDS", value = tostring(var.jwt_expires_in_seconds) },
        { name = "CORS_ORIGIN", value = var.cors_origin },
        { name = "POSTGRES_HOST", value = aws_db_instance.postgres.address },
        { name = "POSTGRES_PORT", value = tostring(aws_db_instance.postgres.port) },
        { name = "POSTGRES_USER", value = var.postgres_user },
        { name = "POSTGRES_DB", value = var.postgres_db },
        { name = "POSTGRES_SSL", value = "true" },
        { name = "ADMIN_BOOTSTRAP_ON_STARTUP", value = var.admin_bootstrap_on_startup ? "true" : "false" },
        { name = "ADMIN_EMAIL", value = var.admin_email },
        { name = "ADMIN_NAME", value = var.admin_name },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "S3_BUCKET", value = aws_s3_bucket.media.bucket },
        { name = "S3_PUBLIC_BASE_URL", value = local.media_public_base_url },
        { name = "DYNAMODB_TABLE_NAME", value = aws_dynamodb_table.app.name }
      ]

      secrets = [
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = "${aws_secretsmanager_secret.api.arn}:POSTGRES_PASSWORD::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.api.arn}:JWT_SECRET::"
        },
        {
          name      = "ADMIN_PASSWORD"
          valueFrom = "${aws_secretsmanager_secret.api.arn}:ADMIN_PASSWORD::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.api.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = local.api_name
  cluster         = aws_ecs_cluster.api.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.api_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.api.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = var.api_container_port
  }

  health_check_grace_period_seconds = 90

  depends_on = [
    aws_lb_listener.api_http_forward,
    aws_lb_listener.api_http_redirect,
    aws_lb_listener.api_https
  ]
}
