const WebSocket = require('ws');

class OpenClawWsClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const authUrl = `${this.url}/?auth=${this.token}`;
      this.ws = new WebSocket(authUrl);

      this.ws.on('open', () => {
        console.log('Connected to OpenClaw gateway');
        resolve();
      });

      this.ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      });

      this.ws.on('close', () => {
        console.log('WebSocket closed');
        // Tentativa de reconexão automática
        setTimeout(() => {
          console.log('Tentando reconectar...');
          this.connect().catch(e => console.error('Falha na reconexão:', e));
        }, 2000);
      });

      this.ws.on('error', (err) => {
        console.error('WebSocket error', err);
        reject(err);
      });
    });
  }

  sendRpc(method, params) {
    return new Promise((resolve, reject) => {
      this.requestId++;
      const id = this.requestId;
      const payload = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  spawnSession(label, thinking) {
    return this.sendRpc('sessions.spawn', { label, thinking });
  }

  sendMessage(sessionKey, message) {
    return this.sendRpc('sessions.send', { sessionKey, message });
  }

}

module.exports = OpenClawWsClient;
