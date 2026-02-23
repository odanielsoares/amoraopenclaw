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
- **Status:** ativo (infra ok; gog Calendar ok; falta rotina do heartbeat + consolidar memória/feedback loops)
- **Próximo passo:** implementar rotina do heartbeat **Drive + Calendar** (calendário: `primary`, conta: `daniels.soares@outlook.com`) + rodar `openclaw memory index --all`.
- **Bloqueios:** definir onde persistir/configurar `GOG_KEYRING_PASSWORD` e automatizar o check de calendário (24–48h, conflito, <2h).
