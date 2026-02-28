"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useAgentsStore } from "@/store/agents";
import { SECTORS, STATUS_TO_SECTOR } from "@/types/agent";
import type { SectorId } from "@/types/agent";
import { Sector } from "./Sector";
import { AgentAvatar } from "../agents/AgentAvatar";

export function MissionControlGrid() {
  const agents = useAgentsStore((s) => s.agents);

  const agentsBySector = useMemo(() => {
    const map: Record<SectorId, typeof agents[string][]> = {
      inbox: [],
      research: [],
      planning: [],
      execution: [],
      waiting: [],
      errors: [],
      completed: [],
    };

    for (const agent of Object.values(agents)) {
      const sector = STATUS_TO_SECTOR[agent.status];
      map[sector].push(agent);
    }

    return map;
  }, [agents]);

  return (
    <div className="relative flex-1 p-4 overflow-auto">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(59,130,246,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Title bar */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-mc-accent animate-pulse" />
          <h1 className="text-sm font-mono font-bold tracking-[0.3em] uppercase text-mc-text/70">
            Mission Control
          </h1>
          <div className="w-2 h-2 rounded-full bg-mc-accent animate-pulse" />
        </div>
        <div className="text-[10px] font-mono text-mc-muted">
          {Object.keys(agents).length} agents deployed
        </div>
      </div>

      {/* Grid layout */}
      <div
        className="relative grid gap-3 h-[calc(100%-40px)]"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gridTemplateAreas: `
            "inbox research planning execution"
            "inbox research planning execution"
            "waiting errors completed completed"
          `,
        }}
      >
        {SECTORS.map((sector) => (
          <Sector
            key={sector.id}
            sector={sector}
            agentCount={agentsBySector[sector.id].length}
          >
            <AnimatePresence mode="popLayout">
              {agentsBySector[sector.id].map((agent) => (
                <AgentAvatar key={agent.agentId} agent={agent} />
              ))}
            </AnimatePresence>
          </Sector>
        ))}

        {/* Connection lines between sectors (decorative) */}
        <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible opacity-10">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
