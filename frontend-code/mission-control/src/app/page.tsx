"use client";

import { MissionControlGrid } from "@/components/mission-control/MissionControlGrid";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { AgentDetailDrawer } from "@/components/agents/AgentDetailDrawer";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useMockSimulation } from "@/hooks/useMockSimulation";

export default function Home() {
  useWebSocket();
  useMockSimulation();

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-mc-bg">
      {/* Main mission control area */}
      <MissionControlGrid />

      {/* Right sidebar */}
      <Sidebar />

      {/* Agent detail drawer (modal) */}
      <AgentDetailDrawer />
    </main>
  );
}
