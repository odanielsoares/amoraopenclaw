"use client";

import { useEffect, useRef } from "react";
import { useAgentsStore } from "@/store/agents";
import { MOCK_AGENTS, generateRandomEvent } from "@/mocks/agents";

const SIMULATION_INTERVAL = 3000;

export function useMockSimulation() {
  const wsConnected = useAgentsStore((s) => s.wsConnected);
  const initAgents = useAgentsStore((s) => s.initAgents);
  const updateAgent = useAgentsStore((s) => s.updateAgent);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initAgents(MOCK_AGENTS);
      initializedRef.current = true;
    }
  }, [initAgents]);

  useEffect(() => {
    if (wsConnected) return;

    const interval = setInterval(() => {
      const event = generateRandomEvent();
      updateAgent(event);
    }, SIMULATION_INTERVAL);

    return () => clearInterval(interval);
  }, [wsConnected, updateAgent]);
}
