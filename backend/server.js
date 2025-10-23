const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = 3001;

// Optional: serve static files or API
app.get("/", (req, res) => res.send("WebSocket server running"));

const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("🌐 Client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(message.toString());
    });
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
