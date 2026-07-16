# Frontend Web Agent

Este agent rege `apps/web`.

## Regras

- Mantenha a experiencia login-first.
- Use `system.manifest.json` para identidade visual/nome do sistema.
- Rotas autenticadas devem passar pelo shell em `AuthenticatedLayout`.
- Nao duplicar contratos da API quando houver tipos/helpers locais.
