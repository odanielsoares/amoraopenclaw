# Lições aprendidas (consolidado 2026-02-28)

## O que funcionou
- Deploy clean: clonar o repo oficial + seguir README (install → build → PM2) funcionou rapidamente para Mission Control.
- Mission Control conecta direto ao OpenClaw Gateway via WebSocket; não há necessidade de bridge adicional na maioria dos casos.
- Uso de PM2 para gerenciar processos é estável e permite fácil rollback/limpeza com `pm2 delete all`.
- RapidAPI (twitter-x2) provê endpoints úteis (Trends, UserTweets, User lookup) úteis para monitoramento com limites claros.

## O que não funcionou / problemas
- Tentar consertar um deploy remendado (muitos processos órfãos, nginx configs quebrados, service workers) atrasou a entrega — restart do zero foi a solução.
- Criar bridge Python introduziu complexidade e pontos de falha desnecessários.
- Publicação via API bloqueada (401/403) por falta de permissões do app no X Developer Portal — é necessário confirmar permissões ou usar wrapper com POST.
- Mudanças rápidas em nginx via scripts podem gerar erros de sintaxe se `$` não for escapado.

## Regras operacionais
- Sempre testar `nginx -t` antes de reload.
- Para deploys problemáticos: `pm2 delete all` → limpar artefatos → deploy fresh.
- Testar WebSocket com cliente real (wscat) — curl pode ser enganoso.
- Ter rota /clear-client para limpar service workers em testes de corte.

## Insight
- Quando a complexidade sobe, priorizar isolamento e re-criação limpa traz velocidade e previsibilidade. Investir tempo em identificar e remover artefatos antigos evita loops de troubleshooting.
