export type AgentStatus =
  | "idle"
  | "researching"
  | "thinking"
  | "executing"
  | "waiting_input"
  | "blocked"
  | "error"
  | "completed";

export type AgentEvent = {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  taskTitle?: string;
  progress?: number;
  startedAt?: string;
  updatedAt?: string;
  source?: string;
  message?: string;
  error?: string | null;
};

export type Agent = AgentEvent & {
  logs: ActivityLogEntry[];
};

export type ActivityLogEntry = {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  previousStatus?: AgentStatus;
  newStatus: AgentStatus;
  message: string;
};

export type SectorId =
  | "inbox"
  | "research"
  | "planning"
  | "execution"
  | "waiting"
  | "errors"
  | "completed";

export type Sector = {
  id: SectorId;
  label: string;
  description: string;
  color: string;
  glowColor: string;
  icon: string;
  gridArea: string;
};

export const STATUS_TO_SECTOR: Record<AgentStatus, SectorId> = {
  idle: "inbox",
  researching: "research",
  thinking: "planning",
  executing: "execution",
  waiting_input: "waiting",
  blocked: "waiting",
  error: "errors",
  completed: "completed",
};

export const SECTORS: Sector[] = [
  {
    id: "inbox",
    label: "INBOX",
    description: "Aguardando designacao",
    color: "#64748b",
    glowColor: "rgba(100, 116, 139, 0.2)",
    icon: "📥",
    gridArea: "inbox",
  },
  {
    id: "research",
    label: "RESEARCH",
    description: "Coleta de dados",
    color: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.2)",
    icon: "🔍",
    gridArea: "research",
  },
  {
    id: "planning",
    label: "PLANNING",
    description: "Analise e estrategia",
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.2)",
    icon: "🧠",
    gridArea: "planning",
  },
  {
    id: "execution",
    label: "EXECUTION",
    description: "Operacao em andamento",
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.2)",
    icon: "⚡",
    gridArea: "execution",
  },
  {
    id: "waiting",
    label: "WAITING",
    description: "Aguardando input",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.2)",
    icon: "⏳",
    gridArea: "waiting",
  },
  {
    id: "errors",
    label: "ERRORS",
    description: "Requer atencao",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.2)",
    icon: "🚨",
    gridArea: "errors",
  },
  {
    id: "completed",
    label: "COMPLETED",
    description: "Missoes concluidas",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.2)",
    icon: "✅",
    gridArea: "completed",
  },
];

export const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; color: string; pulseColor: string }
> = {
  idle: { label: "Idle", color: "#64748b", pulseColor: "rgba(100,116,139,0.4)" },
  researching: { label: "Researching", color: "#8b5cf6", pulseColor: "rgba(139,92,246,0.4)" },
  thinking: { label: "Thinking", color: "#3b82f6", pulseColor: "rgba(59,130,246,0.4)" },
  executing: { label: "Executing", color: "#22c55e", pulseColor: "rgba(34,197,94,0.4)" },
  waiting_input: { label: "Waiting", color: "#f59e0b", pulseColor: "rgba(245,158,11,0.4)" },
  blocked: { label: "Blocked", color: "#f97316", pulseColor: "rgba(249,115,22,0.4)" },
  error: { label: "Error", color: "#ef4444", pulseColor: "rgba(239,68,68,0.4)" },
  completed: { label: "Completed", color: "#10b981", pulseColor: "rgba(16,185,129,0.4)" },
};
