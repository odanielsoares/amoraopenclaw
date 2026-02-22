# decisions.md — Decisões permanentes

**Propósito:** registrar decisões que não devem ser “redescobertas” a cada sessão.

## Formato (padrão)
- **Data:** YYYY-MM-DD
- **Decisão:** o que foi decidido
- **Contexto:** por que isso existiu
- **Trade-off:** o que ganhamos/perdemos
- **Status:** vigente | revisitar em YYYY-MM-DD

---

## 2026-02-22 — Modelo primário e fallback
- **Decisão:** usar **OpenAI como primário** e **Anthropic como fallback**.
- **Como ficou:** `openai/gpt-5.2` → `anthropic/claude-3-sonnet-20240229` → `anthropic/claude-3-opus-20240229` → `anthropic/claude-3-haiku-20240307`.
- **Contexto:** Anthropic entrou em cooldown por rate limit; queremos estabilidade no dia a dia.
- **Trade-off:** custo/qualidade previsíveis no primário; fallback Claude pode ter cooldown e deve ser tratado como reserva.
- **Status:** vigente
