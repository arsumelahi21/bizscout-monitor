import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});