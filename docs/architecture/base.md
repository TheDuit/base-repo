# Base generica

Esta base e um ponto de partida para novos sistemas. Ela preserva uma fundacao
tecnica validada, mas remove regras especificas de negocio.

## O que fica

- Monorepo `apps/api` + `apps/web`.
- API NestJS com autenticacao JWT, usuarios, permissoes e health check.
- Frontend Next.js com login, dashboard simples e gestao de usuarios.
- PostgreSQL via TypeORM migrations.
- Docker Compose local e Dockerfiles de producao.
- Terraform AWS para Web estatico em S3/CloudFront, API em ECS Fargate, RDS,
  DynamoDB, ECR e Secrets Manager.
- Deploy automatico opcional via GitHub Actions.

## O que sai

- Ordens de servico.
- Chamados.
- Prestadores.
- Regras de negocio especificas.
- Manuais e documentos comerciais especificos.

## Manifesto canonico

O arquivo `system.manifest.json` na raiz e a fonte canonica para identidade do
sistema:

```json
{
  "systemName": "base-system",
  "displayName": "Base System"
}
```

Altere esse arquivo ao criar um fork. API, Web e Terraform devem derivar nome e
identidade do sistema a partir dele. Variaveis de ambiente continuam existindo
para segredos e detalhes de runtime, mas nao devem ser a fonte primaria do nome
do produto.
