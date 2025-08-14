import { Router } from 'express';
import axios from 'axios';

const router = Router();

// TODO: Replace placeholders with real logic

router.get('/github/login', (req, res) => {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID || '');
  url.searchParams.set('scope', process.env.GITHUB_SCOPES || 'repo');
  url.searchParams.set('redirect_uri', `${process.env.BASE_URL}/auth/github/callback`);
  res.redirect(url.toString());
});

router.get('/github/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    const r = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.BASE_URL}/auth/github/callback`
    }, { headers: { Accept: 'application/json' } });
    // store token in session
    (req.session as any).gh = { token: r.data.access_token };
    res.redirect((process.env.WEB_ORIGIN || 'http://localhost:5173') + '/app');
  } catch (e) {
    res.status(500).json({ message: 'OAuth exchange failed', error: String(e) });
  }
});

router.get('/me', async (req, res) => {
  const token = (req.session as any)?.gh?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const me = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(me.data);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch user', error: String(e) });
  }
});

router.post('/logout', (req, res) => {
  req.session = null as any;
  res.json({ ok: true });
});

export default router;
