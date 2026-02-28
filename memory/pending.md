# Pendências (atualizado 2026-02-28)

## Conteúdo / X
- [ ] Confirmar permissões de escrita (write) para o app "teste123dan" no X Developer Portal e gerar Access Token & Secret para esse app — Dono: Dan
- [ ] Se app não obtiver write, escolher alternativa: usar RapidAPI wrapper com POST (caso suporte) ou solicitar elevação do app (Dan)
- [ ] Validar lógica de scoring para publicação automática (definir algoritmo e thresholds) — Dono: Amora/Dan
- [ ] Definir lista final de perfis prioritários e idioma principal (Dan)

## Mission Control / Operação
- [ ] Diagnosticar `openclaw cron run` com gateway timeout (mesmo com RPC ok) — Dono: Amora
- [ ] Corrigir crons com `cron announce delivery failed` (migrar para delivery none/bestEffort ou ajustar destino) — Dono: Amora
- [ ] Abrir e revisar PR da sanitização infra (`sanitize/infra-redaction-2026-02-28`) — Dono: Dan/Amora
pp e re-tentar publicação de teste — Dono: Dan/Amora
- [ ] Monitorar estabilidade Nginx/gateway por 15–30 minutos após deploy final (Amora)

Notas: tokens e credenciais já salvos localmente em /root/mission-control/.env.local (gitignored).