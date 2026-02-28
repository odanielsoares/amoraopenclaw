const WebSocket = require('ws');

class OpenClawWebSocketClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.requestId = 1;
    this.ws = null;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url, { headers: { 'Authorization': `Bearer ${this.token}` } });
      this.ws.on('open', () => {
        console.log('WebSocket connected');
        resolve();
      });
      this.ws.on('message', (data) => {
        let msg = JSON.parse(data);
        if (msg.id && this.pending.has(msg.id)) {
          const {resolve, reject} = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      });
      this.ws.on('error', reject);
      this.ws.on('close', () => console.log('WebSocket closed'));
    });
  }

  callMethod(method, params) {
    return new Promise((resolve, reject) => {
      const id = this.requestId++;
      const payload = { jsonrpc: '2.0', id, method, params };
      this.pending.set(id, {resolve, reject});
      this.ws.send(JSON.stringify(payload));
    });
  }

  async spawnAgent(label, thinking) {
    return await this.callMethod('sessions.spawn', { label, thinking });
  }

  async sendMessage(sessionKey, message) {
    return await this.callMethod('sessions.send', { sessionKey, message });
  }

}

module.exports = OpenClawWebSocketClient;
