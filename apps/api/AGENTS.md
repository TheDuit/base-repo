# Backend API Agent

Este agent rege `apps/api`.

## Regras

- Rotas privadas exigem JWT por padrao.
- Rotas publicas devem usar `@Public()`.
- Rotas administrativas devem usar `@RequirePermissions(...)`.
- Nao exponha `password_hash`.
- Schema evolui apenas por migrations.
- `systemName` vem de `system.manifest.json` via `SystemManifestService`.
- `backoffice_admin` tem permissao total via `permissions = ["*"]`.
