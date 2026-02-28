"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAgentsStore } from "@/store/agents";
import type { AgentEvent } from "@/types/agent";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_DELAY = 30000;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectDelayRef = useRef(RECONNECT_DELAY);
  const mountedRef = useRef(true);

  const updateAgent = useAgentsStore((s) => s.updateAgent);
  const setWsConnected = useAgentsStore((s) => s.setWsConnected);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setWsConnected(true);
        reconnectDelayRef.current = RECONNECT_DELAY;
        console.log("[WS] Connected to", WS_URL);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const data = JSON.parse(event.data);

          if (data.type === "agent_update" && data.payload) {
            updateAgent(data.payload as AgentEvent);
          } else if (data.type === "batch_update" && Array.isArray(data.payload)) {
            for (const agentEvent of data.payload) {
              updateAgent(agentEvent as AgentEvent);
            }
          } else if (data.agentId) {
            updateAgent(data as AgentEvent);
          }
        } catch (err) {
          console.warn("[WS] Failed to parse message:", err);
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setWsConnected(false);
        console.log("[WS] Disconnected. Reconnecting in", reconnectDelayRef.current, "ms");

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * 1.5,
            MAX_RECONNECT_DELAY
          );
          connect();
        }, reconnectDelayRef.current);
      };

      ws.onerror = (err) => {
        console.warn("[WS] Error:", err);
        ws.close();
      };
    } catch (err) {
      console.warn("[WS] Connection failed:", err);
      reconnectTimeoutRef.current = setTimeout(connect, reconnectDelayRef.current);
    }
  }, [updateAgent, setWsConnected]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [connect]);
}
