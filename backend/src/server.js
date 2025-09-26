import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectToDatabase } from './config/db.js';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teamtasker';

async function bootstrap() {
  try {
    await connectToDatabase(MONGO_URI);
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();

