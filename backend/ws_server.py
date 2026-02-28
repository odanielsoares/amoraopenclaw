import asyncio
import json
import websockets
import datetime

AGENT_ID = "amora"
AGENT_NAME = "Amora"

STATUS_OPTIONS = ["idle", "researching", "thinking", "executing", "waiting_input", "blocked", "error", "completed"]

async def send_agent_update(websocket):
    while True:
        now = datetime.datetime.utcnow().isoformat() + "Z"
        agent_event = {
            "type": "agent_update",
            "payload": {
                "agentId": AGENT_ID,
                "agentName": AGENT_NAME,
                "status": "executing",
                "taskTitle": "Executando tarefa exemplo",
                "progress": 60,
                "startedAt": now,
                "updatedAt": now,
                "source": "backend",
                "message": "Progresso em 60%",
                "error": None
            }
        }
        await websocket.send(json.dumps(agent_event))
        await asyncio.sleep(10)

async def handle_command(command):
    # Implementar processamento de comandos recebidos
    print("Comando recebido:", command)

async def websocket_handler(websocket, path):
    print("Cliente conectado")
    send_task = asyncio.create_task(send_agent_update(websocket))
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get("type") == "amora_command":
                await handle_command(data.get("payload"))
    except Exception as e:
        print("Erro websocket:", e)
    finally:
        send_task.cancel()
        print("Cliente desconectado")

async def main():
    async with websockets.serve(websocket_handler, "localhost", 4000):
        print("WebSocket Server rodando na porta 4000")
        await asyncio.Future()  # roda indefinidamente

if __name__ == "__main__":
    asyncio.run(main())
