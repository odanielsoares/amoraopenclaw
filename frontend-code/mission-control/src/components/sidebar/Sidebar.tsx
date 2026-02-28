"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAgentsStore } from "@/store/agents";
import { STATUS_CONFIG } from "@/types/agent";
import type { AgentStatus } from "@/types/agent";
import { ActivityFeed } from "../feed/ActivityFeed";

function StatCard({
  label,
  value,
  color,
  glow,
}: {
  label: string;
  value: number | string;
  color: string;
  glow?: boolean;
}) {
  return (
    <div
      className="px-3 py-2 rounded-lg border border-mc-border/50 bg-mc-surface/50"
      style={glow ? { boxShadow: `0 0 15px ${color}15` } : {}}
    >
      <p className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">{label}</p>
      <p className="text-lg font-mono font-bold mt-0.5" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export function Sidebar() {
  const agents = useAgentsStore((s) => s.agents);
  const wsConnected = useAgentsStore((s) => s.wsConnected);

  const stats = useMemo(() => {
    const agentList = Object.values(agents);
    const active = agentList.filter((a) =>
      ["researching", "thinking", "executing"].includes(a.status)
    ).length;
    const waiting = agentList.filter((a) =>
      ["waiting_input", "blocked"].includes(a.status)
    ).length;
    const errors = agentList.filter((a) => a.status === "error").length;
    const completed = agentList.filter((a) => a.status === "completed").length;
    const idle = agentList.filter((a) => a.status === "idle").length;

    const activeTasks = agentList.filter(
      (a) => a.startedAt && !["idle", "completed"].includes(a.status)
    );
    let avgTime = "—";
    if (activeTasks.length > 0) {
      const totalMs = activeTasks.reduce((sum, a) => {
        return sum + (Date.now() - new Date(a.startedAt!).getTime());
      }, 0);
      const avgMs = totalMs / activeTasks.length;
      const mins = Math.floor(avgMs / 60000);
      avgTime = `${mins}m`;
    }

    return { total: agentList.length, active, waiting, errors, completed, idle, avgTime };
  }, [agents]);

  return (
    <div className="w-[320px] h-full border-l border-mc-border bg-mc-panel/80 backdrop-blur-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-mc-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-mc-text/70">
            Control Panel
          </h2>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: wsConnected ? "#22c55e" : "#ef4444",
              }}
              animate={{
                scale: wsConnected ? [1, 1.3, 1] : 1,
                opacity: wsConnected ? [1, 0.6, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-[10px] font-mono text-mc-muted">
              {wsConnected ? "LIVE" : "MOCK"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-mc-border">
        <StatCard label="Total Agents" value={stats.total} color="#e2e8f0" />
        <StatCard label="Active" value={stats.active} color="#22c55e" glow={stats.active > 0} />
        <StatCard label="Waiting" value={stats.waiting} color="#f59e0b" glow={stats.waiting > 0} />
        <StatCard label="Errors" value={stats.errors} color="#ef4444" glow={stats.errors > 0} />
        <StatCard label="Completed" value={stats.completed} color="#10b981" />
        <StatCard label="Avg Time" value={stats.avgTime} color="#8b5cf6" />
      </div>

      {/* Status breakdown */}
      <div className="px-4 py-3 border-b border-mc-border">
        <p className="text-[10px] font-mono text-mc-muted uppercase tracking-wider mb-2">
          Status Breakdown
        </p>
        <div className="space-y-1.5">
          {(Object.entries(STATUS_CONFIG) as [AgentStatus, (typeof STATUS_CONFIG)[AgentStatus]][]).map(
            ([status, config]) => {
              const count = Object.values(agents).filter(
                (a) => a.status === status
              ).length;
              return (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-[10px] font-mono text-mc-muted flex-1">
                    {config.label}
                  </span>
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: count > 0 ? config.color : "#334155" }}
                  >
                    {count}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-mc-border">
          <p className="text-[10px] font-mono text-mc-muted uppercase tracking-wider">
            Activity Feed
          </p>
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
