import cron from 'node-cron';
import { pingAndStore } from '../services/monitorService.js';
import { logger } from '../utils/logger.js';

export function startCron(io) {
  cron.schedule('*/10 * * * * *', async() => {
    const startTime = Date.now();

    logger.info({
      event: 'cron_start',
      time: new Date().toISOString(),
    }, 'Cron job started');
    try {
      const result = await pingAndStore(io);

      const duration = Date.now() - startTime;

      logger.info({
        event: 'cron_success',
        duration,
        recordId: result?.id || null,
      }, 'Cron job completed');

    } catch (err) {
      const duration = Date.now() - startTime;

      logger.error({
        event: 'cron_error',
        duration,
        error: err.message,
        stack: err.stack,
      }, 'Cron job failed');
    }
  });
    
}