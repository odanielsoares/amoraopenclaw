import { create } from "zustand";
import type { Agent, AgentEvent, AgentStatus, ActivityLogEntry } from "@/types/agent";

function makeLogEntry(
  agent: Agent | AgentEvent,
  previousStatus?: AgentStatus
): ActivityLogEntry {
  const statusMessages: Record<AgentStatus, string> = {
    idle: `${agent.agentName} esta aguardando`,
    researching: `${agent.agentName} iniciou pesquisa`,
    thinking: `${agent.agentName} esta planejando`,
    executing: `${agent.agentName} esta executando`,
    waiting_input: `${agent.agentName} aguarda input`,
    blocked: `${agent.agentName} esta bloqueado`,
    error: `${agent.agentName} encontrou um erro`,
    completed: `${agent.agentName} concluiu a tarefa`,
  };

  return {
    id: `${agent.agentId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    agentId: agent.agentId,
    agentName: agent.agentName,
    previousStatus,
    newStatus: agent.status,
    message: agent.message || statusMessages[agent.status],
  };
}

interface AgentsState {
  agents: Record<string, Agent>;
  activityLog: ActivityLogEntry[];
  selectedAgentId: string | null;
  wsConnected: boolean;

  updateAgent: (event: AgentEvent) => void;
  setSelectedAgent: (id: string | null) => void;
  setWsConnected: (connected: boolean) => void;
  initAgents: (events: AgentEvent[]) => void;
}

const MAX_LOG_ENTRIES = 200;

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: {},
  activityLog: [],
  selectedAgentId: null,
  wsConnected: false,

  updateAgent: (event) =>
    set((state) => {
      const existing = state.agents[event.agentId];
      const previousStatus = existing?.status;
      const logEntry = makeLogEntry(event, previousStatus);

      const updatedAgent: Agent = {
        ...existing,
        ...event,
        updatedAt: event.updatedAt || new Date().toISOString(),
        logs: [...(existing?.logs || []), logEntry].slice(-50),
      };

      return {
        agents: { ...state.agents, [event.agentId]: updatedAgent },
        activityLog: [logEntry, ...state.activityLog].slice(0, MAX_LOG_ENTRIES),
      };
    }),

  setSelectedAgent: (id) => set({ selectedAgentId: id }),

  setWsConnected: (connected) => set({ wsConnected: connected }),

  initAgents: (events) =>
    set(() => {
      const agents: Record<string, Agent> = {};
      const activityLog: ActivityLogEntry[] = [];

      for (const event of events) {
        const logEntry = makeLogEntry(event);
        agents[event.agentId] = {
          ...event,
          logs: [logEntry],
        };
        activityLog.push(logEntry);
      }

      return { agents, activityLog: activityLog.reverse() };
    }),
}));
