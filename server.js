const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

const clients = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "join") {
      clients.set(ws, data.username);
    } else if (data.type === "chat") {
      const username = clients.get(ws);
      const message = JSON.stringify({ type: "chat", username, message: data.message });
      for (const client of clients.keys()) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    }
  });

  ws.on("close", () => clients.delete(ws));
});
