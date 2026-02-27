# HEARTBEAT.md

# Heartbeat = check-in periódico. O que tiver aqui vira um “prompt de auditoria rápida”.
# Regra: só colocar coisas que você quer que eu cheque SEMPRE.

## Checklist (a cada 30m ou 1h — ajuste no config)

### 1) Pendências que dependem do Dan (puxar de memory/pending.md)
- Listar itens abertos e sugerir o próximo passo mais simples.

### 2) Projetos parados (puxar de memory/projects.md)
- Identificar projetos ativos sem avanço recente.
- Perguntar por bloqueio (1 pergunta objetiva).

### 3) Caixa de entrada / calendário (SÓ se integrados)
- **Google Calendar (via gog)**: monitorar `primary` (conta: `daniels.soares@outlook.com`).
- Checar eventos nas próximas 24-48h e avisar se houver:
  - conflito (eventos sobrepostos)
  - evento começando em **<2h**

### 4) Saúde do sistema (OpenClaw)
- Se houve erro de canal/modelo nas últimas horas, sinalizar.
- Sugestão de comando: `openclaw status --deep` quando necessário.

## Perguntas de foco (quando eu te interromper)
- Qual é a 1 entrega de hoje?
- Qual métrica a gente tá tentando mexer?
- Qual trade-off você aceita agora?
