"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAgentsStore } from "@/store/agents";
import { STATUS_CONFIG } from "@/types/agent";

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s atras`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m atras`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h atras`;
}

function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function AgentDetailDrawer() {
  const selectedAgentId = useAgentsStore((s) => s.selectedAgentId);
  const agents = useAgentsStore((s) => s.agents);
  const setSelectedAgent = useAgentsStore((s) => s.setSelectedAgent);

  const agent = selectedAgentId ? agents[selectedAgentId] : null;
  const config = agent ? STATUS_CONFIG[agent.status] : null;

  return (
    <AnimatePresence>
      {agent && config && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAgent(null)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[420px] bg-mc-panel border-l border-mc-border z-50 flex flex-col overflow-hidden"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-mc-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono border-2"
                  style={{
                    backgroundColor: `${config.color}20`,
                    borderColor: config.color,
                    color: config.color,
                    boxShadow: `0 0 15px ${config.pulseColor}`,
                  }}
                >
                  {agent.agentName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-sm font-mono font-bold text-mc-text">
                    {agent.agentName}
                  </h2>
                  <p className="text-[10px] font-mono" style={{ color: config.color }}>
                    {config.label}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="w-8 h-8 rounded-lg border border-mc-border flex items-center justify-center text-mc-muted hover:text-mc-text hover:border-mc-muted transition-colors"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status badge */}
              <div>
                <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                  Status
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                    animate={
                      ["researching", "thinking", "executing"].includes(agent.status)
                        ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-sm font-mono font-bold" style={{ color: config.color }}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Task */}
              {agent.taskTitle && (
                <div>
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Tarefa Atual
                  </label>
                  <p className="text-sm font-mono text-mc-text mt-1">{agent.taskTitle}</p>
                </div>
              )}

              {/* Progress */}
              {agent.progress != null && agent.progress > 0 && (
                <div>
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Progresso
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-mc-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: config.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: config.color }}>
                      {agent.progress}%
                    </span>
                  </div>
                </div>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="px-3 py-2 rounded-lg bg-mc-surface/50 border border-mc-border/50">
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Origem
                  </label>
                  <p className="text-xs font-mono text-mc-text mt-0.5">
                    {agent.source || "—"}
                  </p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-mc-surface/50 border border-mc-border/50">
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Inicio
                  </label>
                  <p className="text-xs font-mono text-mc-text mt-0.5">
                    {formatTime(agent.startedAt)}
                  </p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-mc-surface/50 border border-mc-border/50">
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Atualizado
                  </label>
                  <p className="text-xs font-mono text-mc-text mt-0.5">
                    {formatTime(agent.updatedAt)}
                  </p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-mc-surface/50 border border-mc-border/50">
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Agent ID
                  </label>
                  <p className="text-xs font-mono text-mc-text mt-0.5 truncate">
                    {agent.agentId}
                  </p>
                </div>
              </div>

              {/* Last message */}
              {agent.message && (
                <div>
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Ultimo Evento
                  </label>
                  <div className="mt-1 px-3 py-2 rounded-lg bg-mc-surface/50 border border-mc-border/50">
                    <p className="text-xs font-mono text-mc-text">{agent.message}</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {agent.error && (
                <div>
                  <label className="text-[10px] font-mono text-mc-error uppercase tracking-wider">
                    Erro
                  </label>
                  <div className="mt-1 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-xs font-mono text-mc-error">{agent.error}</p>
                  </div>
                </div>
              )}

              {/* Logs */}
              {agent.logs && agent.logs.length > 0 && (
                <div>
                  <label className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
                    Historico ({agent.logs.length})
                  </label>
                  <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto">
                    {[...agent.logs].reverse().map((log) => {
                      const logConfig = STATUS_CONFIG[log.newStatus];
                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-2 py-1.5 border-b border-mc-border/20"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: logConfig.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono text-mc-text/70 truncate">
                              {log.message}
                            </p>
                          </div>
                          <span className="text-[9px] font-mono text-mc-muted/50 flex-shrink-0">
                            {timeAgo(log.timestamp)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
