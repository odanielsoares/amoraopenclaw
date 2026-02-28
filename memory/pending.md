# Pendências (atualizado 2026-02-28)

- [ ] Confirmar permissões de escrita (write) para o app "teste123dan" no X Developer Portal e gerar Access Token & Secret para esse app — Dono: Dan
- [ ] Se app não obtiver write, escolher alternativa: usar RapidAPI wrapper com POST (caso suporte) ou solicitar elevação do app (Dan)
- [ ] Validar lógica de scoring para publicação automática (definir algoritmo e thresholds) — Dono: Amora/Dan
- [ ] Definir lista final de perfis prioritários e idioma principal (Dan)
- [ ] Configurar rotina (cron) no OpenClaw/Mission Control para monitoramento diário (1x/2x) e controle de consumo de API (Amora)
- [ ] Teste de publicação: gerar Access Token/Secret para novo app e re-tentar publicação de teste — Dono: Dan/Amora
- [ ] Monitorar estabilidade Nginx/gateway por 15–30 minutos após deploy final (Amora)

Notas: tokens e credenciais já salvos localmente em /root/mission-control/.env.local (gitignored).