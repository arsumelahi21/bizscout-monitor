import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { startCron } from './jobs/cron.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

startCron(io);
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});