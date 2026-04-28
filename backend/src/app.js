import express, { json } from 'express';
import cors from 'cors';
import { PORT } from './config/env.js';
import http from 'http';
import { Server } from 'socket.io';
import { startCron } from './jobs/cron.js';
import { pingAndStore } from './services/monitorService.js';
import logRoutes from './routes/logRoutes.js';

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(json());
app.use('/api', logRoutes);




app.get('/trigger', async (req, res) => {
  const data = await pingAndStore(io);
  res.json(data);
});

const io = new Server(server, {
  cors: { origin: '*' },
});

startCron(io);
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});