# Decisões permanentes (atualizado)

- Hospedar Mission Control no domínio principal odanielsoares.tech (sem subdomínio) para reduzir complexidade de DNS e certificados. Por quê: controle e menor superfície de configuração.
- Usar rota /ws no domínio principal para WebSocket (proxy para bridge local 127.0.0.1:4000). Por quê: evitar propagação DNS e simplificar TLS.
- Não publicar tokens/secretos em git; remover token.json de histórico e armazenar tokens criptografados localmente (token.json.enc). Por quê: segurança.
- Preferência de autenticação local para deploy inicial (AUTH_MODE=local) com token forte em backend/.env; Clerk ou outro provider podem ser ativados depois. Por quê: simplificar testes e acesso inicial.
- Usar PM2 para gerenciar mission-control & gateway-bridge em produção no servidor. Por quê: autostart e facilidade de gerenciamento.
- Bloquear rotas sensíveis (/chat, /sessions) via Nginx até confirmar que o novo dashboard está estável. Por quê: reduzir exposição enquanto fazemos cutover.

Source: memory/2026-02-28.md
