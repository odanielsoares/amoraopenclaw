# Módulo 2: Segurança (Hardening) - Plano e Execução

## Objetivo
Garantir que o servidor OpenClaw esteja protegido contra ataques comuns, com foco em proteção de acesso e credenciais.

## Passos Detalhados

### 1. Validar e configurar dmPolicy allowlist
- Confirmar que o OpenClaw está restrito via Telegram DM allowlist

### 2. Configurar firewall UFW
- Deny incoming default
- Allow outgoing default
- Allow SSH (porta 22)
- Enable firewall
- Verificar status

### 3. Instalar e configurar Fail2ban
- Instalar fail2ban
- Criar jail.local com regra sshd
- Ativar e reiniciar serviço
- Verificar status jail sshd

### 4. Configurar Cloudflare Tunnel (opcional, para acesso web)
- Instalar cloudflared
- Autenticar
- Criar tunnel
- Configurar ingress
- Rodar como serviço

### 5. Harden SSH
- Verificar sshd_config
- Ajustar PermitRootLogin para prohibit-password (chave só)
- Reiniciar ssh

### 6. Auditoria e limpeza credenciais
- Auditar chaves hardcoded
- Mover para .env e 1Password
- Proteção chmod 600

### 7. systemd + .env sync
- Atualizar override systemd para variáveis
- Recarregar daemon
- Reiniciar openclaw

## Checagem/Validação
- Scripts para verificar cada passo
- Logs e status

## Checklist
- dmPolicy allowlist configurado
- Firewall ativo e regras confirmadas
- Fail2ban ativo para sshd
- SSH hardening aplicado
- Credenciais seguras no .env
- Cloudflare tunnel funcionando se usado

## Próximo passo
Criar scripts automatizados para facilitar esse setup e validação.
