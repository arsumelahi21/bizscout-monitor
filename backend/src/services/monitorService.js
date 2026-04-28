import axios from 'axios';
import pool from '../models/db.js';
import { generatePayload } from '../utils/generatePayload.js';
import { logger } from '../utils/logger.js';

export async function pingAndStore(io) {
  const requestId = `cron-${Date.now()}`; 
  const payload = generatePayload();
  const start = Date.now();

  try {
    logger.info({ requestId, payload }, 'Sending request');

    const res = await retryRequest(() => 
            axios.post('https://httpbin.org/anything', payload));

    const responseTime = Date.now() - start;

    logger.info(
      {requestId, status: res.status, responseTime },
      'Response received'
    );

    const result = await pool.query(
      `INSERT INTO logs (request, response, status, response_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [payload, res.data, res.status, responseTime]
    );

    const saved = result.rows[0];

    //  Realtime broadcast
    if (io) {
      io.emit('new-log', saved);
    }

    logger.info(
      { requestId, id: saved.id, responseTime },
      'New log saved'
    );

    return saved;

  } catch (err) {
    logger.error(
      { requestId, error: err.message, stack: err.stack },
      'Ping failed after retries'
    );
    return null;
  }
}

async function retryRequest(fn, retries = 3) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn(
        { attempt: i + 1, error: err.message },
        'Retry failed'
      );
    }
  }

  throw lastError;
}