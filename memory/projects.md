# Projetos ativos (atualizado 2026-02-28)

## Mission Control — odanielsoares.tech
- **Objetivo:** Dashboard de orquestração de agentes OpenClaw (criar tasks, planejar com AI, dispatch para agentes, acompanhar em tempo real)
- **Repo:** crshdn/mission-control (clonado em /root/mission-control)
- **Stack:** Next.js + TypeScript + SQLite + Tailwind
- **Deploy:** PM2 (porta 4000) + Nginx (SSL via Let's Encrypt)
- **Gateway:** ws://127.0.0.1:18789 — conectado ✅
- **Auth:** MC_API_TOKEN configurado; browser acessa direto (same-origin)
- **Status:** Deploy fresh feito em 28/02/2026. Build limpo, rodando, conectado ao Gateway.
- **URL:** https://odanielsoares.tech
- **Logs:**
  - PM2: /root/.pm2/logs/mission-control-*.log
  - Nginx: /var/log/nginx/*.log

## Sistema de Agentes (OpenClaw)
- **Hub:** Amora (L4, Opus) — coordenação e orquestração
- **Content:** Agente de produção (L1, Sonnet) — planejado, ainda não operacional via Mission Control
- **Scraper:** Agente de coleta (L1, Sonnet) — planejado, ainda não operacional via Mission Control
- **Configs:** /root/.openclaw/workspace/shared/agents_configs/

Dono: Dan (decisões) / Amora (execução)
