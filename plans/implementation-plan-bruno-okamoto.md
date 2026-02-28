# Plano Geral de Implementação - Projeto Bruno Okamoto OpenClaw

## Visão geral
Implementar sistema AI COO seguindo o curso Bruno Okamoto, baseado em 6 PRDs centrais, 10 módulos e princípios operacionais rigorosos.

---

## Etapas principais

### Módulo 1: VPS Setup Hostinger
- Criar VPS bare metal Ubuntu 24.04 (sem Docker)
- Instalar OpenClaw e rodar onboard wizard
- Conectar Anthropic + Telegram bot com política allowlist
- Checklist de segurança e testes iniciais

### Módulo 2: Segurança (Hardening)
- Configurar firewall (UFW) e Fail2ban
- Configurar Cloudflare Tunnel para acesso web seguro
- Auditar e mover credenciais para .env + 1Password
- Harden SSH e serviços (systemd/env sync)

### Módulo 3: Arquitetura e Ciclo de Memória
- Criar estrutura memory/ e topic files (decisions, lessons...)
- Configurar índice MEMORY.md e ciclos de extração e consolidação
- Implementar feedback loops para aprendizado contínuo

### Módulo 4: Integrações Essenciais
- Configurar Google Calendar, Telegram DM
- Configurar Google Drive e Notion
- Configurar 1Password CLI para credenciais
- Automatizar crons para monitoramento e métricas

### Módulo 5: Skills e Proatividade
- Criar skills núcleo organizacionais
- Organizar prompts para proatividade

### Módulo 6: Multi-Agentes
- Configurar hub e agentes especializados com SOUL.md
- Implementar nivåção L1-L4 e revisão semanal
- Criar shared context (shared/, TEAM.md)

### Módulo 7: Sistema Imunológico
- Criar watchdog crons e retry automático
- Configurar alertas no Telegram
- Garantir sub-agent com follow-up e retry
- Backup automático antes de mudanças

### Módulo 8: Pads, Playbooks e Templates
- Desenvolver templates visuais padrão (PDF, docs)
- Criar playbooks para onboarding, operações e problemas comuns

### Módulo 9: Deployment e Segurança Git
- Automatizar secrets management (.env, 1Password)
- Limpador histórico git (BFG/git-filter-repo)
- Política de commits e revisões

### Módulo 10: Monitoramento e Feedback automáticos
- Implementar monitor contínuo sob demanda
- Feedback loops de qualidade e melhoria contínua
- Dashboards básicos de indicadores (healthy, erro, custo)

---

## Prioridade atual
1. Entrega Módulo 1 + checklist (Setup VPS + OpenClaw + Telegram)
2. Segurança hardening básico
3. Memória e integrações
4. Multi-agentes + imunidade
5. Playbooks e deployment seguro
6. Automação e monitoramento


---

Atualizarei semanalmente com progresso, descobertas e revisões do plano.

🍇 Amora
