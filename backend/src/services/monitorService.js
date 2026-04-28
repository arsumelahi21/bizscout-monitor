import axios from 'axios';
import pool from '../models/db.js';
import { generatePayload } from '../utils/generatePayload.js';
import { logger } from '../utils/logger.js';

export async function pingAndStore(io) {

  const requestId = `cron-${Date.now()}`; 
  const payload = generatePayload();
  const start = Date.now();
  

  try {

    await new Promise(resolve => setTimeout(resolve, 3000));
    logger.info({ requestId, payload }, 'Sending request');

    const res = await retryRequest(() => 
            axios.post('https://httpbin.org/anything', payload));

    const responseTime = Date.now() - start;

    const stats = await pool.query(`
      SELECT 
        AVG(response_time) as avg,
        STDDEV(response_time) as stddev
      FROM logs
      WHERE created_at > NOW() - INTERVAL '1 hour'
    `);

    const avg = Number(stats.rows[0].avg) || 0;
    const stddev = Number(stats.rows[0].stddev) || 0;

    const hasStats = avg > 0 && stddev > 0;

    const zScore = hasStats ? (responseTime - avg) / stddev : 0;

    const is_anomaly = hasStats && Math.abs(zScore) > 1;

      
    logger.info({
      responseTime,
      avg,
      stddev,
      zScore,
      is_anomaly
    });

      if (is_anomaly) {
       logger.warn(
          { requestId, responseTime, avg, stddev, zScore },
          "Anomaly detected"
        );
      }


    logger.info(
      {requestId, status: res.status, responseTime },
      'Response received'
    );

    const result = await pool.query(
      `INSERT INTO logs (request, response, status, response_time, is_anomaly)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [payload, res.data, res.status, responseTime, is_anomaly]
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