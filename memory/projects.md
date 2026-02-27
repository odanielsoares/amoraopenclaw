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
- **Objetivo:** configurar OpenClaw com Telegram, modelos, failover, memória e heartbeat inteligente.
- **Status:** ativo (infra ok; gog Calendar integrado; speech-to-text via OpenAI disponível; cron 08:00/19:00 ativo)
- **Conquistas recentes:**
  - Integração `gog` com Google Calendar (conta: daniels.soares@outlook.com, calendário `primary`).
  - Google Calendar API habilitada no projeto `amora-api`.
  - Configuração de `GOG_KEYRING_PASSWORD` persistido via `/root/.openclaw/.env` e carregado pelo systemd do openclaw-gateway.
  - Heartbeat 30min desativado.
  - Cron 2x/dia (08:00 e 19:00 UTC-3) criado e ativo.
- **Próximo passo:**
  - Implementar lógica automática definitiva de conflito e alerta <2h.
  - Rodar `openclaw memory index --all`.
- **Bloqueios:**
  - Nenhum bloqueio estrutural ativo.
