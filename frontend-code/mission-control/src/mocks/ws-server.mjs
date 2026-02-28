import { WebSocketServer } from "ws";

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });

const AGENT_NAMES = ["Nova", "Atlas", "Orion", "Vega", "Lyra", "Zenith", "Pulse", "Echo"];
const STATUSES = [
  "idle",
  "researching",
  "thinking",
  "executing",
  "waiting_input",
  "blocked",
  "error",
  "completed",
];
const TASKS = [
  "Gerar relatorio de vendas Q4",
  "Analisar concorrencia SaaS",
  "Planejar campanha de lancamento",
  "Configurar pipeline de deploy",
  "Sincronizar base de clientes",
  "Gerar newsletter semanal",
  "Otimizar queries do banco",
  "Processar pedidos pendentes",
];
const SOURCES = ["slack", "email", "dashboard", "github", "api", "cron", "monitoring", "webhook"];
const MESSAGES = {
  idle: ["Aguardando nova tarefa", "Disponivel para alocacao"],
  researching: ["Coletando dados...", "Buscando informacoes...", "Analisando fontes..."],
  thinking: ["Planejando abordagem...", "Definindo estrategia...", "Avaliando opcoes..."],
  executing: ["Processando...", "Executando operacao...", "Em andamento..."],
  waiting_input: ["Aguardando aprovacao", "Necessita input do usuario"],
  blocked: ["Recurso indisponivel", "Dependencia nao resolvida"],
  error: ["Erro de conexao", "Timeout na operacao", "Falha na execucao"],
  completed: ["Tarefa finalizada com sucesso", "Operacao concluida"],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEvent() {
  const idx = Math.floor(Math.random() * AGENT_NAMES.length);
  const status = pick(STATUSES);
  const msgs = MESSAGES[status];

  return {
    type: "agent_update",
    payload: {
      agentId: `agent-${String(idx + 1).padStart(3, "0")}`,
      agentName: AGENT_NAMES[idx],
      status,
      taskTitle: status === "idle" ? undefined : pick(TASKS),
      progress:
        status === "completed"
          ? 100
          : status === "idle"
            ? 0
            : Math.floor(Math.random() * 90) + 10,
      startedAt:
        status === "idle"
          ? undefined
          : new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      source: pick(SOURCES),
      message: pick(msgs),
      error: status === "error" ? "Simulated error: " + pick(msgs) : null,
    },
  };
}

// Send initial batch on connection
function sendInitialState(ws) {
  const batch = {
    type: "batch_update",
    payload: AGENT_NAMES.map((name, i) => {
      const status = pick(STATUSES);
      const msgs = MESSAGES[status];
      return {
        agentId: `agent-${String(i + 1).padStart(3, "0")}`,
        agentName: name,
        status,
        taskTitle: status === "idle" ? undefined : pick(TASKS),
        progress:
          status === "completed" ? 100 : status === "idle" ? 0 : Math.floor(Math.random() * 90) + 10,
        startedAt:
          status === "idle"
            ? undefined
            : new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        source: pick(SOURCES),
        message: pick(msgs),
        error: status === "error" ? "Simulated error: " + pick(msgs) : null,
      };
    }),
  };
  ws.send(JSON.stringify(batch));
}

console.log(`[Mock WS Server] Running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("[Mock WS Server] Client connected");
  sendInitialState(ws);

  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(generateEvent()));
    }
  }, 2000 + Math.random() * 3000);

  ws.on("close", () => {
    console.log("[Mock WS Server] Client disconnected");
    clearInterval(interval);
  });
});
