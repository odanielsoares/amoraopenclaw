# Decisões permanentes (atualizado 2026-02-28)

- **Domínio principal:** odanielsoares.tech (sem subdomínio) para Mission Control. Motivo: simplicidade de DNS/SSL.
- **Proxy reverso:** Nginx faz proxy / → localhost:4000 (Next.js). WebSocket handled pelo próprio Next.js.
- **Secrets nunca em git.** Tokens em .env.local (gitignored) ou criptografados.
- **PM2 para processos em produção** (mission-control). Autostart configurado.
- **Auth local** com MC_API_TOKEN para API externa; browser same-origin passa direto.
- **Gateway bind loopback only** (127.0.0.1:18789). Acesso externo só via proxy se necessário.
- **Modelos:** Opus para decisões/interação direta, Sonnet para execução/crons, Haiku/GPT-mini para heartbeats.
- **Deploy fresh em 28/02/2026:** versão anterior descartada; repo crshdn/mission-control clonado do zero.
