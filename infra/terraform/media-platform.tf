resource "aws_cloudfront_origin_access_control" "media" {
  name                              = "${local.name_prefix}-media-oac"
  description                       = "CloudFront access to media bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "media" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = var.media_price_class
  aliases         = var.media_domain_name != null ? [var.media_domain_name] : []

  origin {
    domain_name              = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.media.id
    origin_access_control_id = aws_cloudfront_origin_access_control.media.id
  }

  default_cache_behavior {
    target_origin_id       = aws_s3_bucket.media.id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.media_acm_certificate_arn == null
    acm_certificate_arn            = var.media_acm_certificate_arn
    ssl_support_method             = var.media_acm_certificate_arn == null ? null : "sni-only"
    minimum_protocol_version       = var.media_acm_certificate_arn == null ? "TLSv1" : "TLSv1.2_2021"
  }
}

data "aws_iam_policy_document" "media_bucket_policy" {
  statement {
    sid = "AllowCloudFrontRead"

    actions = ["s3:GetObject"]

    resources = [
      "${aws_s3_bucket.media.arn}/*"
    ]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.media.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.media.id
  policy = data.aws_iam_policy_document.media_bucket_policy.json
}

locals {
  media_public_base_url = "https://${coalesce(var.media_domain_name, aws_cloudfront_distribution.media.domain_name)}"
}
