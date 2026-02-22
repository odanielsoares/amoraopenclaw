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
- **Próximo passo:** implementar heartbeat **Drive + Calendar** (Calendar ID confirmado) + rodar `openclaw memory index --all`.
- **Bloqueios:** confirmar Calendar ID (qual calendário monitorar) e implementar rotina do heartbeat (Drive + Calendar).
