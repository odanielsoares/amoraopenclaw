# Mission Control — Deploy Notes (Dan / Amora)

Este repositório é um **snapshot** da versão do Mission Control que está rodando no servidor do Dan.

## Infra (servidor)
- Next.js app via PM2 na porta **4000**
- Nginx reverse proxy com SSL (Let's Encrypt) servindo o domínio **odanielsoares.tech**
- OpenClaw Gateway: `ws://127.0.0.1:18789`

## PM2 (start)
```bash
cd /root/mission-control
pm2 start "bash -lc 'set -a; [ -f .env.local ] && source .env.local; set +a; npx next start -p 4000'" --name mission-control
pm2 save --force
```

## Nginx (exemplo)
Arquivo exemplo: `/etc/nginx/conf.d/mission-control.conf`

```nginx
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}

server {
  listen 443 ssl;
  server_name odanielsoares.tech;

  ssl_certificate /etc/letsencrypt/live/odanielsoares.tech/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/odanielsoares.tech/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }
}

server {
  listen 80;
  server_name odanielsoares.tech;
  return 301 https://$host$request_uri;
}
```

## DNS
Para funcionar em qualquer rede (IPv4 + IPv6):
- `A @` → IPv4 do servidor (ex.: `<SERVER_IPV4>`)
- `AAAA @` → IPv6 do servidor (ex.: `<SERVER_IPV6>`)
- Recomenda-se também `A www` e `AAAA www` (em vez de CNAME) para evitar caches estranhos.

## Segredos
Nunca commitar `.env.local`. Tokens ficam apenas no servidor.
