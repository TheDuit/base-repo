# Infra e Docker

- Docker local deve espelhar o runtime de producao quando possivel.
- Terraform deve ler identidade canonica de `system.manifest.json`.
- Nao versionar state, tfvars locais, secrets ou artefatos de build.
