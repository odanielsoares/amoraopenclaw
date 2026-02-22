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
- **Lição:** se todos os perfis de um provider entram em cooldown, **toda a cadeia de fallback daquele provider falha**.
- **Sinal de alerta:** `No available auth profile (all in cooldown)`.
- **Ação padrão:** manter um primário estável (OpenAI) e/ou adicionar fallback alternativo antes do provider em risco.
