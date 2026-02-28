import asyncio
from gateway_rpc import openclaw_call, GatewayConfig

class AgentAmora:
    def __init__(self, config: GatewayConfig):
        self.config = config
        self.agent_id = 'amora'
        self.agent_name = 'Amora'
        self.status = 'idle'
        self.task_title = None
        self.progress = 0

    async def update_status(self, status, task_title=None, progress=0):
        self.status = status
        self.task_title = task_title
        self.progress = progress

        payload = {
            'agentId': self.agent_id,
            'agentName': self.agent_name,
            'status': self.status,
            'taskTitle': self.task_title,
            'progress': self.progress,
            'startedAt': None,
            'updatedAt': None,
            'source': 'backend',
            'message': f'Status updated to {self.status}',
            'error': None
        }

        await openclaw_call('agent_update', payload, config=self.config)

    async def send_message(self, message):
        # Implementar envio de mensagem ao chat se necessário
        pass

    async def run_loop(self):
        while True:
            # Exemplo de atualização periódica
            await self.update_status('executing', 'Executando tarefa exemplo', 25)
            await asyncio.sleep(15)  # esperar 15s para próxima atualização
            await self.update_status('executing', 'Continuando tarefa', 50)
            await asyncio.sleep(15)
            await self.update_status('completed', 'Tarefa concluída', 100)
            await asyncio.sleep(60)  # esperar 1 min antes de reiniciar


async def main():
    config = GatewayConfig(url='wss://gateway.example.com', token='your-real-token')
    amora = AgentAmora(config)
    await amora.run_loop()

if __name__ == '__main__':
    asyncio.run(main())
