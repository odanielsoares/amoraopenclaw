"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentsStore } from "@/store/agents";
import { STATUS_CONFIG } from "@/types/agent";

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "agora";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export function ActivityFeed() {
  const activityLog = useAgentsStore((s) => s.activityLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activityLog.length]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
      <AnimatePresence initial={false}>
        {activityLog.slice(0, 50).map((entry) => {
          const config = STATUS_CONFIG[entry.newStatus];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 py-1.5 border-b border-mc-border/30"
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-mono text-mc-text/80 leading-tight truncate">
                  <span className="font-bold" style={{ color: config.color }}>
                    {entry.agentName}
                  </span>{" "}
                  <span className="text-mc-muted">&rarr;</span>{" "}
                  <span style={{ color: config.color }}>{config.label}</span>
                </p>
                {entry.message && (
                  <p className="text-[10px] font-mono text-mc-muted/70 truncate mt-0.5">
                    {entry.message}
                  </p>
                )}
              </div>
              <span className="text-[9px] font-mono text-mc-muted/50 flex-shrink-0 mt-0.5">
                {timeAgo(entry.timestamp)}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
