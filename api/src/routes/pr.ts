import { Router } from 'express';
import axios from 'axios';

const router = Router();

function gh(token: string) {
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
  });
}

// Simple contents-based PR creation flow
router.post('/create', async (req, res) => {
  const token = (req.session as any)?.gh?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const { owner, repo, baseBranch, newBranch, files, title, body } = req.body as any;
  const api = gh(token);

  // Create branch from base
  const base = await api.get(`/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`);
  const baseSha = base.data.object.sha;
  await api.post(`/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${newBranch}`, sha: baseSha });

  // Put files to new branch using contents API
  for (const f of files) {
    await api.put(`/repos/${owner}/${repo}/contents/${encodeURIComponent(f.path)}`, {
      message: 'chore: add generated tests',
      content: Buffer.from(f.content, 'utf-8').toString('base64'),
      branch: newBranch
    });
  }

  const pr = await api.post(`/repos/${owner}/${repo}/pulls`, {
    title, body, head: newBranch, base: baseBranch
  });

  res.json(pr.data);
});

export default router;
