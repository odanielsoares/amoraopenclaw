"use client";

import { motion } from "framer-motion";
import type { Agent, AgentStatus, STATUS_CONFIG } from "@/types/agent";
import { STATUS_CONFIG as statusConfig } from "@/types/agent";
import { useAgentsStore } from "@/store/agents";

interface AgentAvatarProps {
  agent: Agent;
}

const statusIcons: Record<AgentStatus, string> = {
  idle: "💤",
  researching: "🔍",
  thinking: "🧠",
  executing: "⚡",
  waiting_input: "⏳",
  blocked: "🔒",
  error: "❌",
  completed: "✅",
};

export function AgentAvatar({ agent }: AgentAvatarProps) {
  const setSelectedAgent = useAgentsStore((s) => s.setSelectedAgent);
  const config = statusConfig[agent.status];
  const isActive = ["researching", "thinking", "executing"].includes(agent.status);
  const hasError = agent.status === "error";

  return (
    <motion.button
      layout
      layoutId={`agent-${agent.agentId}`}
      onClick={() => setSelectedAgent(agent.agentId)}
      className="relative group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring for active agents */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-full"
          style={{ backgroundColor: config.pulseColor }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Error shake */}
      <motion.div
        className="relative"
        animate={
          hasError
            ? {
                x: [0, -2, 2, -2, 0],
              }
            : {}
        }
        transition={
          hasError
            ? {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }
            : {}
        }
      >
        {/* Avatar circle */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono border-2 transition-colors"
          style={{
            backgroundColor: `${config.color}20`,
            borderColor: config.color,
            boxShadow: `0 0 12px ${config.pulseColor}`,
            color: config.color,
          }}
        >
          {agent.agentName.charAt(0)}

          {/* Status icon badge */}
          <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none">
            {statusIcons[agent.status]}
          </span>
        </div>

        {/* Progress ring */}
        {agent.progress != null && agent.progress > 0 && agent.progress < 100 && (
          <svg
            className="absolute -inset-0.5 w-[calc(100%+4px)] h-[calc(100%+4px)]"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke={`${config.color}30`}
              strokeWidth="2"
            />
            <motion.circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke={config.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 20}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
              animate={{
                strokeDashoffset:
                  2 * Math.PI * 20 * (1 - (agent.progress || 0) / 100),
              }}
              transition={{ duration: 0.5 }}
              transform="rotate(-90 22 22)"
            />
          </svg>
        )}
      </motion.div>

      {/* Name label */}
      <span className="text-[10px] font-mono font-medium text-mc-text/80 whitespace-nowrap">
        {agent.agentName}
      </span>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="bg-mc-panel border border-mc-border rounded-lg px-3 py-2 shadow-xl min-w-[160px]">
          <p className="text-xs font-mono font-bold text-mc-text">{agent.agentName}</p>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: config.color }}>
            {config.label}
          </p>
          {agent.taskTitle && (
            <p className="text-[10px] font-mono text-mc-muted mt-1 truncate max-w-[200px]">
              {agent.taskTitle}
            </p>
          )}
          {agent.progress != null && agent.progress > 0 && (
            <div className="mt-1.5 h-1 bg-mc-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${agent.progress}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
