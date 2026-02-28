#!/bin/bash

# Script para configurar nginx com reverse proxy para mission.odanielsoares.tech
# Assumindo que o server do dashboard roda em localhost:4000

DOMAIN=mission.odanielsoares.tech

sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Cria arquivo nginx config
cat <<EOF | sudo tee /etc/nginx/sites-available/$DOMAIN
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Testa config e reload
sudo nginx -t && sudo systemctl reload nginx

# Emite certificado TLS com certbot
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m your-email@example.com

# Exibe status
sudo systemctl status nginx

# Firewall
sudo ufw allow 'Nginx Full'
sudo ufw reload
