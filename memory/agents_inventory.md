# Inventário de Agentes (atualizado 2026-02-28)

## Ativos
| Agente | Papel | Nível | Modelo | Status |
|--------|-------|-------|--------|--------|
| Amora | COO / Hub | L4 | Opus | Ativo — sessão principal, Gateway + Mission Control |
| Claudio | Inteligência de Conteúdo — AI & Tech | L1 | GPT | Registrado no Mission Control, aguardando credenciais Twitter/X |

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
