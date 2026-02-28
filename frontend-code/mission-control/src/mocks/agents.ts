import type { AgentEvent, AgentStatus } from "@/types/agent";

export const MOCK_AGENTS: AgentEvent[] = [
  {
    agentId: "agent-001",
    agentName: "Nova",
    status: "executing",
    taskTitle: "Gerar relatorio de vendas Q4",
    progress: 72,
    startedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
    source: "slack",
    message: "Processando dados de receita...",
  },
  {
    agentId: "agent-002",
    agentName: "Atlas",
    status: "researching",
    taskTitle: "Analisar concorrencia no segmento SaaS",
    progress: 35,
    startedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
    source: "email",
    message: "Coletando dados de mercado...",
  },
  {
    agentId: "agent-003",
    agentName: "Orion",
    status: "thinking",
    taskTitle: "Planejar campanha de lancamento",
    progress: 15,
    startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    source: "dashboard",
    message: "Definindo estrategia de canais...",
  },
  {
    agentId: "agent-004",
    agentName: "Vega",
    status: "waiting_input",
    taskTitle: "Configurar pipeline de deploy",
    progress: 60,
    startedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
    source: "github",
    message: "Aguardando aprovacao do PR #142",
  },
  {
    agentId: "agent-005",
    agentName: "Lyra",
    status: "error",
    taskTitle: "Sincronizar base de clientes",
    progress: 88,
    startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
    source: "api",
    message: "Erro de timeout na API externa",
    error: "ETIMEDOUT: Connection timed out after 30s - api.crm.external/v2/sync",
  },
  {
    agentId: "agent-006",
    agentName: "Zenith",
    status: "completed",
    taskTitle: "Gerar newsletter semanal",
    progress: 100,
    startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    source: "cron",
    message: "Newsletter enviada para 2.341 contatos",
  },
  {
    agentId: "agent-007",
    agentName: "Pulse",
    status: "idle",
    taskTitle: undefined,
    progress: 0,
    startedAt: undefined,
    updatedAt: new Date().toISOString(),
    source: undefined,
    message: "Aguardando nova tarefa",
  },
  {
    agentId: "agent-008",
    agentName: "Echo",
    status: "executing",
    taskTitle: "Otimizar queries do banco de dados",
    progress: 45,
    startedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    source: "monitoring",
    message: "Analisando plano de execucao...",
  },
];

const POSSIBLE_STATUSES: AgentStatus[] = [
  "idle",
  "researching",
  "thinking",
  "executing",
  "waiting_input",
  "error",
  "completed",
];

const TASK_TITLES = [
  "Processar pedidos pendentes",
  "Atualizar documentacao da API",
  "Monitorar metricas de performance",
  "Responder tickets de suporte",
  "Gerar relatorio financeiro",
  "Analisar feedback de usuarios",
  "Deploy do microsservico auth",
  "Backup do banco de producao",
];

const MESSAGES: Record<AgentStatus, string[]> = {
  idle: ["Aguardando nova tarefa", "Disponivel para alocacao"],
  researching: ["Coletando dados...", "Buscando informacoes relevantes...", "Analisando fontes..."],
  thinking: ["Planejando abordagem...", "Definindo estrategia...", "Avaliando opcoes..."],
  executing: ["Processando...", "Executando operacao...", "Em andamento..."],
  waiting_input: ["Aguardando aprovacao", "Necessita input do usuario", "Pendente de confirmacao"],
  blocked: ["Recurso indisponivel", "Dependencia nao resolvida"],
  error: ["Erro de conexao", "Timeout na operacao", "Falha na execucao"],
  completed: ["Tarefa finalizada com sucesso", "Operacao concluida"],
};

export function generateRandomEvent(): AgentEvent {
  const agent = MOCK_AGENTS[Math.floor(Math.random() * MOCK_AGENTS.length)];
  const newStatus = POSSIBLE_STATUSES[Math.floor(Math.random() * POSSIBLE_STATUSES.length)];
  const statusMessages = MESSAGES[newStatus];

  return {
    agentId: agent.agentId,
    agentName: agent.agentName,
    status: newStatus,
    taskTitle:
      newStatus === "idle"
        ? undefined
        : TASK_TITLES[Math.floor(Math.random() * TASK_TITLES.length)],
    progress:
      newStatus === "completed"
        ? 100
        : newStatus === "idle"
          ? 0
          : Math.floor(Math.random() * 90) + 10,
    startedAt:
      newStatus === "idle"
        ? undefined
        : new Date(Date.now() - Math.random() * 1000 * 60 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
    source: agent.source,
    message: statusMessages[Math.floor(Math.random() * statusMessages.length)],
    error: newStatus === "error" ? "Simulated error for testing" : null,
  };
}
