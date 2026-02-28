import asyncio
import json
import random
import time
from datetime import datetime, timezone
import websockets

AGENTS = [
    {"agentId": "agent-001", "agentName": "Nova"},
    {"agentId": "agent-002", "agentName": "Atlas"},
    {"agentId": "agent-003", "agentName": "Orion"},
    {"agentId": "agent-004", "agentName": "Vega"},
    {"agentId": "agent-005", "agentName": "Lyra"},
    {"agentId": "agent-006", "agentName": "Zenith"},
    {"agentId": "agent-007", "agentName": "Pulse"},
    {"agentId": "agent-008", "agentName": "Echo"},
]

STATUSES = ["idle", "researching", "thinking", "executing", "waiting_input", "blocked", "error", "completed"]

TASKS = ["Gerar relatorio", "Analisar dados", "Deploy pipeline", "Sync clientes", "Otimizar queries"]

connected = set()

def make_event(agent):
    status = random.choice(STATUSES)
    return {
        "type": "agent_update",
        "payload": {
            "agentId": agent["agentId"],
            "agentName": agent["agentName"],
            "status": status,
            "taskTitle": None if status == "idle" else random.choice(TASKS),
            "progress": 100 if status == "completed" else 0 if status == "idle" else random.randint(10, 95),
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "message": f"{agent['agentName']} -> {status}",
            "error": "Simulated error" if status == "error" else None,
        },
    }

async def handler(websocket):
    connected.add(websocket)
    try:
        batch = {"type": "batch_update", "payload": [make_event(a)["payload"] for a in AGENTS]}
        await websocket.send(json.dumps(batch))
        async for message in websocket:
            data = json.loads(message)
            if data.get("type") == "amora_command":
                content = data.get("payload", {}).get("content", "")
                response = {
                    "type": "amora_response",
                    "payload": {
                        "id": f"msg-{int(time.time())}",
                        "role": "amora",
                        "content": f"Recebi: {content}. Vou processar agora.",
                        "attachments": [],
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "status": "sent"
                    },
                }
                await websocket.send(json.dumps(response))
    finally:
        connected.discard(websocket)

async def broadcast_updates():
    while True:
        await asyncio.sleep(random.uniform(2, 5))
        if connected:
            event = make_event(random.choice(AGENTS))
            await asyncio.gather(*[ws.send(json.dumps(event)) for ws in connected])

async def main():
    print("WS Server rodando em ws://localhost:4000")
    async with websockets.serve(handler, "0.0.0.0", 4000):
        await broadcast_updates()

if __name__ == "__main__":
    asyncio.run(main())
