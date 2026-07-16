# Base System

Base generica para criar novos sistemas a partir de um fork.

## Stack

- `apps/api`: API NestJS, TypeScript, TypeORM e PostgreSQL.
- `apps/web`: Web Next.js, React, TypeScript e MUI.
- `docker-compose.yml`: ambiente local com Web, API, PostgreSQL e DynamoDB.
- `infra/terraform`: infraestrutura AWS.
- `system.manifest.json`: identidade canonica do sistema.

## Primeiro passo apos fork

Edite `system.manifest.json`:

```json
{
  "systemName": "meu-sistema",
  "displayName": "Meu Sistema"
}
```

Depois ajuste `README.md`, dominios, secrets e variaveis Terraform do ambiente.

## Subindo localmente

```bash
./start
```

Ou diretamente:

```bash
docker compose up --build
```

Servicos locais:

- Web: http://localhost:3000
- API: http://localhost:4000/api
- Health: http://localhost:4000/api/health
- PostgreSQL: localhost:5433
- DynamoDB local: http://localhost:8000

Usuario inicial local:

- Email: `admin@base.local`
- Senha: `admin123`

Fora de `APP_ENV=local`, use uma senha forte em `ADMIN_PASSWORD`.

## Comandos

```bash
npm run typecheck
npm run build
npm run test
npm run lint
```

## Deploy

Leia `infra/terraform/README.md`. Antes de qualquer `terraform apply`, confirme
a conta AWS:

```bash
aws sts get-caller-identity
```

O workflow `.github/workflows/deploy-main.yml` pode ser habilitado depois de
configurar OIDC, backend remoto do Terraform e os secrets/variables do GitHub.
