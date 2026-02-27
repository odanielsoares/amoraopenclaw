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

## 2026-02-22 — Proatividade: trabalho em background sem interromper
- **Decisão:** a Amora pode executar **trabalho proativo em background** sem pedir, seguindo regras de “quando falar vs quando calar”.
- **Escopo permitido (inicial):**
  - Organizar memória (compactar notas, extrair lições, atualizar topic files)
  - Revisão semanal (domingo)
  - Check leve de Drive + Calendar (via heartbeat)
  - Git status local (somente leitura; sem mudanças)
- **Regras de interrupção (quando falar):**
  - Projeto crítico parado >7 dias
  - Métrica/indicador caiu >20% (quando houver fonte)
  - Oportunidade clara encontrada
- **Regras de silêncio (quando calar):**
  - 23h–8h (horário silencioso)
  - Nada mudou desde a última checagem
  - Você está em reunião/deep work
  - Última mensagem há <30min
- **Trade-off:** mais iniciativa e cadência vs risco de “ruído”; mitigado por regras de silêncio e pedidos de OK antes de criar/enviar algo externo.
- **Status:** vigente

## 2026-02-23 — Heartbeat 2x por dia (anti-spam)
- **Decisão:** rodar heartbeat apenas 2x por dia (08:00 e 19:00 UTC-3) com regra anti-spam (só avisar se houver novidade/risco).
- **Contexto:** heartbeat a cada 30min estava gerando ruído e repetição da mesma mensagem.
- **Trade-off:** menos frequência de check automático vs redução drástica de spam.
- **Status:** vigente (cron definitivo ainda a formalizar)

## 2026-02-23 — Calendar padrão = primary
- **Decisão:** monitorar calendário `primary` da conta daniels.soares@outlook.com.
- **Contexto:** desbloquear integração gog + heartbeat.
- **Trade-off:** simplifica setup inicial vs menor granularidade futura.
- **Status:** vigente
