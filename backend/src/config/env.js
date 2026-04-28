import dotenv from 'dotenv';

// simplest (recommended for now)
dotenv.config();

export const PORT = process.env.PORT || 5000;