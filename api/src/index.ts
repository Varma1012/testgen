import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';

import authRouter from './routes/auth.js';
import githubRouter from './routes/github.js';
import aiRouter from './routes/ai.js';
import prRouter from './routes/pr.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors({
  origin: process.env.WEB_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'dev',
  httpOnly: true,
  sameSite: 'lax'
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/github', githubRouter);
app.use('/ai', aiRouter);
app.use('/pr', prRouter);

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
