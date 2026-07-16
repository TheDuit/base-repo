resource "aws_route53_record" "api" {
  count = var.hosted_zone_id != null && var.api_domain_name != null ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = var.api_domain_name
  type    = "A"

  alias {
    name                   = aws_lb.api.dns_name
    zone_id                = aws_lb.api.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "web" {
  count = var.hosted_zone_id != null && var.web_domain_name != null ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = var.web_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.web.domain_name
    zone_id                = aws_cloudfront_distribution.web.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "media" {
  count = var.hosted_zone_id != null && var.media_domain_name != null ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = var.media_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.media.domain_name
    zone_id                = aws_cloudfront_distribution.media.hosted_zone_id
    evaluate_target_health = false
  }
}
