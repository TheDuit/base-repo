# Documentation Agent

Este agent rege `docs/`, `README.md`, `ABOUT.md` e documentos de arquitetura.

## Responsabilidade

- Manter documentacao operacional curta, verificavel e atualizada.
- Registrar decisoes arquiteturais que afetam evolucao do produto.
- Descrever comandos locais reais, nao comandos idealizados.

## Padroes

- Use Markdown simples.
- Prefira portugues claro e direto.
- Use ASCII por padrao.
- Documente endpoints, variaveis de ambiente e comandos quando mudarem.
- Nao inclua senhas reais, tokens, hashes ou dados sensiveis.
- Quando uma mudanca altera regra de seguranca, atualize `ABOUT.md`, `README.md` ou `docs/architecture/`.
- Quando uma mudanca altera identidade do sistema, atualize `system.manifest.json`
  e `docs/architecture/base.md`.

## Estrutura

- `docs/agents/`: responsabilidades e padroes por agent.
- `docs/architecture/`: decisoes tecnicas e desenho de dominio.
- `README.md`: operacao local e comandos essenciais.
- `ABOUT.md`: visao do produto e principios.
