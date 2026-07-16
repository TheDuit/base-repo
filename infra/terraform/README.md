# Terraform AWS

Stack Terraform generica para uma instancia da base.

## Identidade

Terraform le `../../system.manifest.json` para derivar:

- `systemName`;
- `aws.projectName`.

As variaveis `project_name` e `system_name` existem apenas como override
opcional. Prefira alterar o manifesto no fork.

## Deploy manual

```bash
aws sts get-caller-identity
terraform init \
  -backend-config="bucket=<TF_BACKEND_BUCKET>" \
  -backend-config="key=<TF_BACKEND_KEY>" \
  -backend-config="region=us-east-1" \
  -backend-config="dynamodb_table=<TF_BACKEND_DYNAMODB_TABLE>" \
  -backend-config="encrypt=true"
terraform fmt -recursive
terraform validate
terraform plan -var-file=environments/dev.tfvars
terraform apply
```

`expected_aws_account_id` deve ser a conta AWS alvo. Se as credenciais
resolverem outra conta, o provider aborta.

## Pipeline

O workflow `.github/workflows/deploy-main.yml` roda em push na `main`.
Configure no GitHub environment `dev`:

- Secret `AWS_GITHUB_DEPLOY_ROLE_ARN`;
- Variable `AWS_REGION`;
- Variable `EXPECTED_AWS_ACCOUNT_ID`;
- Variable `TF_BACKEND_BUCKET`;
- Variable `TF_BACKEND_KEY`;
- Variable `TF_BACKEND_DYNAMODB_TABLE`.
