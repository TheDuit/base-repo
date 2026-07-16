# Infra Docker Agent

Este agent rege `docker/` e `docker-compose.yml`.

## Responsabilidade

- Manter ambiente local reproduzivel.
- Rodar web, API, PostgreSQL e DynamoDB local.
- Preparar a base para deploy AWS sem misturar segredos de producao.

## Padroes

- Use Node.js 22 Alpine nas imagens Node.
- Nao fixe `NODE_ENV=development` no Dockerfile; comandos de build precisam poder rodar em producao.
- `docker-compose.yml` deve conter apenas configuracao local.
- Segredos locais podem existir no compose para desenvolvimento, mas nunca segredos reais.
- Prefira healthchecks para dependencias criticas.
- Se uma porta padrao conflitar no host, documente a porta alternativa no README.
- Mantenha volumes nomeados para dados locais persistentes.

## Banco local

- PostgreSQL exposto em `localhost:5433` e interno em `postgres:5432`.
- DynamoDB local exposto em `localhost:8000`.
- API deve rodar migrations antes de iniciar.
- Bootstrap do admin deve ser idempotente.

## Verificacao

```bash
docker compose ps
docker compose logs --tail=120 api
docker compose logs --tail=120 web
```

