# Lições aprendidas (atualizado 2026-02-28)

## 🔒 Estratégicas (permanentes)

### Deploy do zero > consertar incremental
**Contexto:** Na primeira tentativa de deploy do Mission Control, gastamos horas tentando fazer funcionar um repo/build que tinha problemas acumulados — backend WebSocket intermediário customizado, bridge Python, mocks, configs nginx remendadas, processos PM2 órfãos, caches de service worker, etc. Cada correção gerava um novo problema. O sistema ficou num estado frankenstein onde ninguém sabia mais o que estava rodando.

**O que deu errado (tentativas anteriores):**
- Tentei adaptar/remendar um deploy existente em vez de começar limpo
- Criei camadas desnecessárias (bridge Python entre MC e Gateway) quando o Mission Control já fala WebSocket direto com o Gateway
- Acumulei processos PM2 antigos (arnaldo, ws-tls-proxy, mock servers) que conflitavam
- Nginx foi reconfigurado várias vezes com erros de sintaxe ($ não escapado em scripts)
- Caches e service workers dos clientes mantinham UI antiga mesmo após deploy novo
- Fiz muitas mudanças pequenas sem parar pra reavaliar a abordagem

**O que funcionou (deploy fresh):**
- Apagar tudo e partir do zero: `pm2 delete all`, clone limpo do repo oficial
- Seguir exatamente o README: `git clone` → `npm install` → `.env.local` → `npm run build` → PM2
- Nginx config simples: um arquivo, um proxy, sem bridge intermediária
- Zero customização desnecessária — o projeto já funciona out-of-the-box
- Total: ~5 minutos do clone ao site rodando com 200 OK e Gateway conectado

**Lição:** Quando um deploy acumula remendos e fica instável, é mais rápido e seguro jogar fora e começar do zero do que tentar consertar camada por camada. Resistir ao instinto de "salvar o trabalho já feito" — o custo de consertar geralmente é maior que o de refazer.

### Não adicionar camadas que o projeto não precisa
O Mission Control já se conecta direto ao OpenClaw Gateway via WebSocket. Criar uma bridge Python intermediária foi complexidade desnecessária que só adicionou pontos de falha. Sempre ler o README e entender a arquitetura antes de sair implementando.

### Ler o README primeiro, implementar depois
Na primeira tentativa, assumi como o projeto funcionava e criei componentes extras. Na segunda, segui o README ao pé da letra e funcionou de primeira.

---

## ⏳ Táticas (expiram em 30 dias)

### Nginx & WebSocket
- Handshake WebSocket falha se proxy redirecionar (301) ou não encaminhar Upgrade/Connection
- Sempre usar `map $http_upgrade` no config principal e `proxy_http_version 1.1`
- Testar com `nginx -t` antes de reload
- Escapar `$` quando gravar configs via scripts/heredocs

### PM2
- Sempre `pm2 delete all` + `pm2 save` antes de deploy limpo
- Nomear processos de forma clara (mission-control, não nomes genéricos)

### Testes
- `curl -sk https://localhost -w "%{http_code}"` pra validação rápida
- API do Mission Control: `GET /api/openclaw/status` mostra se Gateway está conectado
- Testar WebSocket com wscat, não curl

### Service Workers / Cache
- Clientes podem manter UI antiga por service workers/cache
- Em caso de corte, ter rota /clear-client ou orientar hard refresh

### Segurança rápida
- Bloquear 80/443 via iptables é eficaz pra tirar site do ar emergencialmente
- Nunca commitar tokens; usar .env.local (gitignored)
