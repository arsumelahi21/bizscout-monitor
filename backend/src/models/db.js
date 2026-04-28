import dotenv from "dotenv";
dotenv.config();
import pkg from 'pg';
import { logger } from '../utils/logger.js';

const { Pool } = pkg;


const pool = new Pool({
  host: process.env.DB_HOST ,
  port: process.env.DB_PORT ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('DB Error:', err);
});

export default pool;