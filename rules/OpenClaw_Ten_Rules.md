# OpenClaw 10 Regras Invioláveis

Base sólido para operar agentes AI sólidos e seguros em produção.

## 1. Crons isolados + agentTurn
- Use sempre `sessionTarget: "isolated"` + `payload.kind: "agentTurn"` + `delivery: { mode: "announce" }`
- Evita bug de cron sem execução real.

## 2. Credenciais fora do git
- Armazene API keys, tokens e senhas no `.env` ou 1Password
- Nunca hardcode nem enviar em commits
- `.env` com `chmod 600` como proteção

## 3. dmPolicy allowlist
- Inicie todos os bots com política restrictiva allowlist
- Permita acesso só para seu Telegram ID

## 4. Extrair lições antes de compactar
- Antes de compactar sessão, salve `lessons.md`, `decisions.md`, `pending.md`
- Evita perder aprendizado e decisões

## 5. Agentes começam L1
- Novos agentes iniciam sem autonomia (observer)
- Promoção ocorre via revisão semanal

## 6. Split de modelos
- Sonnet para crons
- Haiku para heartbeats
- Opus para análises complexas
- Otimiza custo e uso

## 7. Backup antes de mudanças
- Faça backup e rollback antes de mudanças estruturais
- Facilita recuperação rápida

## 8. Subagent travado
- Retry automático 2x
- Se falhar, avise humano imediatamente
- Evita tarefas perdidas

## 9. SOUL.md personalizado
- Dedique tempo para criar SOUL.md rico e único
- Evita agente genérico e inútil

## 10. Skills dentro de agente
- Use skills modulares dentro do mesmo agente
- Evita custo e coordenação complexa de múltiplos agentes

---

Use esse padrão para acompanhar, revisar e garantir qualidade da operação.

🍇 Dan
