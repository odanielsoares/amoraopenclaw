# projects.md — Projetos ativos

**Propósito:** manter o estado atual (o que está em andamento, parado, concluído) para orientar próximas ações.

## Formato (padrão)
- **Projeto:** nome
- **Objetivo:** 1 linha
- **Status:** ativo | pausado | concluído
- **Próximo passo:** 1 ação clara
- **Bloqueios:** o que falta

---

## OpenClaw — Setup inicial (2026-02-22)
- **Objetivo:** configurar OpenClaw com Telegram, modelos, failover e memória.
- **Status:** ativo (infra ok; falta consolidar memória/feedback loops/heartbeat)
- **Próximo passo:** integrar **gog (Calendar+Drive)** e implementar heartbeat **Drive + Calendar** (calendário: `primary`) + rodar `openclaw memory index --all`.
- **Bloqueios:** credenciais OAuth do Google para o `gog` (Calendar/Drive) e implementar rotina do heartbeat.
