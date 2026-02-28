# Projetos ativos (atualizado)

## Mission Control — odanielsoares.tech
- Objetivo: Dashboard realtime para orquestração de agentes OpenClaw; monitorar, planejar e dispatch de tarefas em tempo real.
- Repositório atual usado: crshdn/mission-control (clonado para /root/.openclaw/workspace/openclaw-mission-control)
- Status: build Next.js concluído; deployed via PM2; nginx configurado para proxy / and /ws; bridge em execução.
- Pendências: estabilizar upstream (eliminação de connect() failed), limpar caches client, revisar auth e criar usuários.
- Logs e artifacts:
  - /var/log/nginx/*
  - /root/.pm2/logs/*
  - /root/.openclaw/workspace/openclaw-mission-control (repo)

Dono: Dan (decisões estratégicas), Amora (execução e orquestração)
