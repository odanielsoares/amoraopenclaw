import asyncio
from dataclasses import dataclass

@dataclass
class GatewayConfig:
    url: str = "wss://example-gateway-url"
    token: str = "your-token"

async def openclaw_call(method, params=None, *, config=None):
    print(f"Mock call: {method} with params {params} and config {config}")
    await asyncio.sleep(1)
    return {"status": "success", "method": method, "params": params}
