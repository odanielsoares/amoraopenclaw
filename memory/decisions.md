# Decisões permanentes (atualizado 2026-02-28)

- Hospedar Mission Control no domínio principal odanielsoares.tech (sem subdomínio). Motivo: simplicidade de DNS/SSL e controle central.
- Fazer deploy fresh quando um sistema acumular remendos e ficar instável (apagar e re-clonar do repo oficial). Motivo: reduzir tempo perdido em remendos e processos órfãos.
- Não adicionar camadas intermediárias desnecessárias (ex.: bridge Python) quando o projeto já suporta integração direta com o Gateway.
- Usar PM2 para gerenciar processos (mission-control, gateway-bridge) em produção.
- Inicializar agentes no Mission Control lendo configs em shared/agents_configs/ e sincronizar SOUL.md/USER.md/AGENTS.md com os registros locais do MC via API.
- Política de publicação para Claudio (L3): máximo 3 posts/dia; horário 09:00–21:00 BRT; tópicos proibidos: política, religião, saúde; critério de publicação automático: score ≥ 8; links + afirmação factual forte → aprovação humana.
- Manter tokens/secretos em .env.local (gitignored); nunca commitar chaves em repositórios.
- **Workflow padrão:** toda tarefa solicitada pelo Dan neste chat deve ser **replicada como Task no Mission Control** (workspace default), com acompanhamento em tempo real no Kanban/Live Feed (status + comentários + entregáveis). Responder no chat com resumo + ID/link da task.
- **Guardar links importantes:** sempre que o Dan enviar um link (repo, doc, ferramenta), registrar na memória permanente para reutilização.

Dono das decisões: Dan (estratégico) / Amora (execução).