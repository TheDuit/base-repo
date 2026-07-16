# Mapa de Infra AWS

Referencia da infraestrutura generica provisionada por `infra/terraform`.

## Componentes

- VPC com subnets publicas e privadas.
- NAT Gateway unico para ambiente pequeno.
- ECR para imagem da API.
- ECS Fargate para API.
- ALB publico para API.
- RDS PostgreSQL privado.
- DynamoDB para uso futuro da aplicacao.
- S3 privado para midia/arquivos.
- S3 privado + CloudFront OAC para Web estatico.
- Secrets Manager para senha do banco, JWT e senha inicial de admin.

## Identidade canonica

Terraform le `system.manifest.json`:

```txt
system.manifest.json -> systemName, displayName, aws.projectName
```

Use variaveis Terraform apenas como override deliberado.

## Fluxo

```txt
Internet
  |
  v
CloudFront Web
  |--- /api/* ---> ALB ---> ECS Fargate API ---> RDS PostgreSQL
  |
  v
S3 Web privado
```

## Seguranca

- Confirme a conta AWS antes de `plan` e `apply`.
- Use `expected_aws_account_id`.
- Use backend remoto S3 com DynamoDB lock para state.
- Nao versionar `terraform.tfvars` nem `terraform.tfstate`.
