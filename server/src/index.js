import express from 'express';
import { connectDb } from './lib/db.js';
import { teckelsRouter } from './routes/teckels.js';

const app = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/teckels', teckelsRouter);

const port = Number(process.env.PORT || 3001);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

