# lessons.md — Lições aprendidas

**Propósito:** capturar padrões do que funcionou/não funcionou, para não repetir erro.

## Retenção
- 🔒 **Estratégicas:** permanentes (princípios, padrões de operação)
- ⏳ **Táticas:** expiram/revisar em 30 dias (workarounds, bugs pontuais)

## Formato (padrão)
- **Data:** YYYY-MM-DD
- **Lição:** 1 frase
- **Sinal de alerta:** como reconhecer cedo
- **Ação padrão:** o que fazer da próxima vez

---

## 2026-02-22 (tática) — Cooldown de provider pode derrubar cadeia inteira
- **Lição:** se todos os perfis de um provider entram em cooldown, toda a cadeia de fallback daquele provider falha.
- **Sinal de alerta:** `No available auth profile (all in cooldown)`.
- **Ação padrão:** manter primário estável (OpenAI) e adicionar fallback alternativo antes do provider em risco.

## 2026-02-23 (tática) — OAuth remoto exige step 1 + step 2 rapidamente
- **Lição:** fluxo remoto do gog expira rápido; é preciso rodar step 2 logo após gerar o link.
- **Sinal de alerta:** erro de state inválido ou callback expirado.
- **Ação padrão:** preparar previamente variável de ambiente (GOG_KEYRING_PASSWORD) e executar step 2 imediatamente após receber callback.

## 2026-02-27 (estratégica) — NUNCA mexer em SSH/segurança de acesso sem confirmação
- **Lição:** alterei PermitRootLogin sem verificar se Dan tinha SSH key. Quase travou acesso ao servidor.
- **Sinal de alerta:** qualquer comando que altere sshd_config, firewall rules ou acesso remoto.
- **Ação padrão:** Módulo 2 (segurança de infra) = Dan executa manualmente. Eu só audito, recomendo e gero comandos. NUNCA executar direto.

## 2026-02-23 (estratégica) — Heartbeat frequente sem regra de novidade vira ruído
- **Lição:** checagem automática sem filtro de “mudança” gera spam e reduz confiança no sistema.
- **Sinal de alerta:** mensagens repetidas com o mesmo status.
- **Ação padrão:** aplicar regra “só notificar se houver mudança, risco ou decisão necessária”.
