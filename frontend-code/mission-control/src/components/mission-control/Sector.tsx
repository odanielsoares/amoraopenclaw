"use client";

import { motion } from "framer-motion";
import type { Sector as SectorType } from "@/types/agent";

interface SectorProps {
  sector: SectorType;
  agentCount: number;
  children: React.ReactNode;
}

export function Sector({ sector, agentCount, children }: SectorProps) {
  return (
    <motion.div
      className="relative rounded-xl border border-mc-border bg-mc-surface/60 backdrop-blur-sm overflow-hidden"
      style={{ gridArea: sector.gridArea }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent animate-scan-line" />
      </div>

      {/* Glow border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${sector.glowColor}, 0 0 15px ${sector.glowColor}`,
        }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-4 py-2 border-b border-mc-border/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">{sector.icon}</span>
          <div>
            <h3
              className="text-xs font-mono font-bold tracking-[0.2em] uppercase"
              style={{ color: sector.color }}
            >
              {sector.label}
            </h3>
            <p className="text-[10px] text-mc-muted font-mono">{sector.description}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
          style={{
            backgroundColor: `${sector.color}15`,
            color: sector.color,
            border: `1px solid ${sector.color}30`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: sector.color,
              boxShadow: agentCount > 0 ? `0 0 6px ${sector.color}` : "none",
            }}
          />
          {agentCount}
        </div>
      </div>

      {/* Agent area */}
      <div className="relative p-3 min-h-[100px] flex flex-wrap gap-2 content-start">
        {children}
      </div>

      {/* Grid pattern background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </motion.div>
  );
}
