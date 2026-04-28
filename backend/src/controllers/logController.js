import pool from '../models/db.js';
import { success, error } from '../utils/apiResponse.js';

export async function getLogs(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    
    if (isNaN(page) || page < 1)  page = 1;
    if (isNaN(limit) || limit < 1)  limit = 10;
    

    if (limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limit cannot exceed 100'
      });
    }

    const offset = (page - 1) * limit;

    const [dataResult, countResult] = await Promise.all([
      pool.query(
        `SELECT * FROM logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM logs`)
    ]);

    return success(res, dataResult.rows, {
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
    });

  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch logs');
  }
}