# Lições aprendidas (atualizado)

- Nginx & WebSocket: o handshake WebSocket falha se o proxy redirecionar (301) ou não encaminhar cabeçalhos Upgrade/Connection. Sempre garantir map $http_upgrade no config principal (fora dos server {}) e location = /ws com proxy_http_version 1.1 e proxy_set_header Connection $connection_upgrade.
- Testar com curl não substitui um cliente WebSocket real: curl pode retornar 200, mas handshake WSS pode falhar por HTTP/2 ou ALPN. Use wscat / Python websockets para testar end-to-end.
- Clientes podem manter UI antiga por causa de service workers/IndexedDB/caches; ter uma rota /clear-client com JS para unregister + clearStorage é útil para testes de corte.
- Durante deploys intensivos, reiniciar serviços sem coordenação gera 502/503 (upstream refused). Ordem: subir bridge (ws) antes do app, garantir healthcheck up → depois apontar nginx.
- Remover processos/artefatos antigos é crítico: processos antigos (arnaldo) ou sites estáticos em /var/www/html podem confundir a tomada de posse do domínio. Sempre fazer backup e um checklist de stop/delete antes do cutover.
- Quando algo der errado e você precise tirar o site do ar imediatamente, bloquear 80/443 via iptables é rápido e eficaz; documentar procedimento de rollback.

O que funcionou
- PM2 + wrapper start script para Next.js (estável após configuração). Build do repo criou rotas e assets corretamente.
- bridge (gateway-bridge) conseguiu autenticar com o OpenClaw Gateway quando a URL/token estavam corretos.

O que não funcionou bem
- Mudanças rápidas no nginx sem escapar $ nas write scripts causaram erros de sintaxe (invalid number of arguments in map/proxy_set_header). Sempre testar nginx -t e escapar $ quando gravar configs via scripts.

