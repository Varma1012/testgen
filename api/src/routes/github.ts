// apps/api/routes/github.ts
import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
import qs from "querystring";

dotenv.config();
const router = Router();

// Utility to get GitHub API client
function getGitHubClient(req: any) {
  const token = req.session?.gh?.token;
  if (!token) return null;
  return axios.create({
    baseURL: "https://api.github.com",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Step 1: Redirect to GitHub OAuth
router.get("/login", (req, res) => {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID || "");
  url.searchParams.set("scope", process.env.GITHUB_SCOPES || "repo");
  url.searchParams.set("redirect_uri", `${process.env.BASE_URL}/api/github/callback`);
  res.redirect(url.toString());
});

// Step 2: Handle callback
router.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ message: "Missing code parameter" });

  try {
    const body = qs.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.BASE_URL}/api/github/callback`,
    });

    const r = await axios.post("https://github.com/login/oauth/access_token", body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    (req.session as any).gh = { token: r.data.access_token };
    res.redirect(process.env.WEB_ORIGIN + "/app");
  } catch (e) {
    res.status(500).json({ message: "OAuth exchange failed", error: String(e) });
  }
});

// Step 3: Get authenticated GitHub user
router.get("/me", async (req, res) => {
  const client = getGitHubClient(req);
  if (!client) return res.status(401).json({ message: "Not authenticated" });
  try {
    const me = await client.get("/user");
    res.json(me.data);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch user", error: String(e) });
  }
});

// Step 4: Logout
router.post("/logout", (req, res) => {
  req.session = null as any;
  res.json({ ok: true });
});

// Get authenticated user's repositories
router.get("/repos", async (req, res) => {
  const client = getGitHubClient(req);
  if (!client) return res.status(401).json({ message: "Not authenticated" });

  try {
    const reposRes = await client.get("/user/repos", {
      params: { per_page: 100, sort: "updated" },
    });
    res.json(reposRes.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch repos", error: String(err) });
  }
});

// ✅ New: Get branches for a repo
router.get("/branches", async (req, res) => {
  const { owner, repo } = req.query;
  const client = getGitHubClient(req);
  if (!client) return res.status(401).json({ message: "Not authenticated" });
  if (!owner || !repo) return res.status(400).json({ message: "Missing owner or repo" });

  try {
    const branchesRes = await client.get(`/repos/${owner}/${repo}/branches`);
    res.json(branchesRes.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch branches", error: String(err) });
  }
});

// ✅ New: Get file tree for a repo & branch
router.get("/tree", async (req, res) => {
  const { owner, repo, branch } = req.query;
  const client = getGitHubClient(req);
  if (!client) return res.status(401).json({ message: "Not authenticated" });
  if (!owner || !repo || !branch)
    return res.status(400).json({ message: "Missing owner, repo, or branch" });

  try {
    // Get commit SHA for the branch
    const refRes = await client.get(`/repos/${owner}/${repo}/git/refs/heads/${branch}`);
    const commitSha = refRes.data.object.sha;

    // Get tree recursively
    const treeRes = await client.get(`/repos/${owner}/${repo}/git/trees/${commitSha}?recursive=1`);
    const tree = treeRes.data.tree;

    // Only return files (type === 'blob')
    const files = tree.filter((item: any) => item.type === "blob");
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch file tree", error: String(err) });
  }
});



// ✅ New: Get file contents for selected paths
router.post("/files", async (req, res) => {
  const { owner, repo, files, branch } = req.body;
  const client = getGitHubClient(req);
  if (!client) return res.status(401).json({ message: "Not authenticated" });
  if (!owner || !repo || !files || !Array.isArray(files)) {
    return res.status(400).json({ message: "Missing owner, repo, or files array" });
  }

  try {
    const branchName = branch ;

    const fileContents = await Promise.all(
      files.map(async (path: string) => {
        const fileRes = await client.get(
          `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
          {
            headers: { Accept: "application/vnd.github.v3.raw" },
            params: { ref: branchName },
          }
        );

        return { path, content: fileRes.data };
      })
    );

    res.json(fileContents);
  } catch (err: any) {
    console.error("❌ Failed to fetch file contents:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "File(s) not found in repo/branch" });
    }
    res.status(500).json({ message: "Failed to fetch file contents", error: String(err) });
  }
});



export default router;

