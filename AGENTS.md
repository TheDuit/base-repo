# Agents

Este arquivo define regras gerais para evoluir a base generica.

## Regras globais

- Preserve seguranca por padrao: rotas privadas exigem token e permissao.
- Nao use `synchronize` do TypeORM para evoluir schema; crie migrations.
- Nunca exponha `password_hash` em respostas HTTP, logs, DTOs ou docs.
- Logs da API devem ser JSON single-line e carregar `systemName`, `userId`,
  `sessionId`, metodo HTTP, rota e handler quando houver requisicao HTTP.
- O nome do sistema deve vir de `system.manifest.json`; variaveis de ambiente
  podem apontar outro manifesto, mas nao devem ser a fonte primaria.
- Backoffice admin tem permissao total via `permissions = ["*"]`.
- Mantenha regras de dominio em services/classes de dominio, nao em controllers.
- Mantenha alteracoes pequenas, revisaveis e alinhadas ao modulo tocado.

## Verificacao padrao

```bash
docker compose exec api npm run typecheck -w apps/api
docker compose exec api npm run build -w apps/api
docker compose exec web npm run typecheck -w apps/web
docker compose exec web npm run build -w apps/web
```
