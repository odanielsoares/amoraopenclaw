# Projetos ativos (atualizado 2026-02-28)

## Mission Control — Dashboard de orquestração
- **URL:** https://odanielsoares.tech
- **Repo upstream:** https://github.com/crshdn/mission-control
- **Deploy:** PM2 (Next.js em :4000) + Nginx reverse proxy + SSL
- **Gateway:** ws://127.0.0.1:18789

## Repo do Dan (Infra/OpenClaw)
- **Repo:** https://github.com/odanielsoares/amoraopenclaw.git
- **Uso:** armazenar versão/infra de deploy funcional (docs/configs) para reproduzir setup.

## BlogBot — Conteúdo recorrente (Precificação Impressão 3D)
- **Objetivo:** gerar e publicar conteúdo recorrente para o SaaS de precificação (PT-BR + EN), com SEO.
- **Publicação:** Supabase Edge Function `create-blog-post`
  - Base URL: https://zfwwaeualfmsjobflnpj.supabase.co/functions/v1/create-blog-post
  - Auth: header `x-api-key` com `BLOG_API_KEY`
- **Runner:** `/root/.openclaw/workspace/automation/3dprint-pricing-bot/run.mjs` (RSS → LLM → POST)
- **Crons (todos os dias, America/Sao_Paulo):**
  - 08:10 — PT-BR
  - 11:10 — EN
  - 14:10 — PT-BR
  - 17:10 — EN
- **Fonte/config:** `automation/3dprint-pricing-bot/sources.ptbr.json` + `PROMPT_ARTICLE.md`
