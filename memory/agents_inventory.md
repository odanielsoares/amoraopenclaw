# Inventário de Agentes (atualizado 2026-02-28)

## Ativos
| Agente | Papel | Nível | Modelo | Status |
|--------|-------|-------|--------|--------|
| Amora | COO / Hub | L4 | Opus | Ativo — sessão principal, Gateway + Mission Control |
| Claudio | Inteligência de Conteúdo — AI & Tech | L1→L3 (configurado) | GPT (openai/gpt-5.1-codex) | Registrado no Mission Control, standby (aguardando confirmação de publish permissions)

## Planejados
| Agente | Papel | Nível | Modelo | Status |
|--------|-------|-------|--------|--------|
| Scraper | Coleta de dados | L1 | Sonnet | Config criada, não ativado |

## Configs
- Amora: shared/agents_configs/Amora/SOUL.md
- Claudio: shared/agents_configs/Claudio/SOUL.md + CONFIG.md
- Scraper: shared/agents_configs/Scraper/SOUL.md

## Infraestrutura
- Gateway: ws://127.0.0.1:18789 (loopback)
- Mission Control: https://odanielsoares.tech (conectado ao gateway)
- PM2: mission-control (porta 4000)

## Notas
- Claudio criado e registrado no Mission Control (id: 2367f88e-f088-4c07-af39-dae76e63f176)
- Task exemplo criada: "Relatório Claudio — ciclo 1" (id: 6491f1f5-5e61-45d4-89cc-81ec454a7aca) e movida no Kanban para validar sincronização de status.
