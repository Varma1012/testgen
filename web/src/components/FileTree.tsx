import React from "react";
import axios from "axios";
import { useStore } from "../lib/store";

export default function FileTree() {
  const { owner, repo, branch, selected, toggleFile, setSummaries } = useStore();
  const [files, setFiles] = React.useState<any[]>([]);
  const [q, setQ] = React.useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  React.useEffect(() => {
    console.log("📂 FileTree trigger:", owner, repo, branch);
    if (!owner || !repo || !branch) return;

    axios
      .get(`${baseURL}/api/github/tree`, {
        withCredentials: true,
        params: { owner, repo, branch },
      })
      .then((r) => {
        console.log("✅ Files fetched:", r.data);
        setFiles(r.data);
      })
      .catch((err) =>
        console.error("❌ Failed to fetch files:", err.response || err)
      );
  }, [owner, repo, branch, baseURL]);

  const filtered = files.filter((f) =>
    f.path.toLowerCase().includes(q.toLowerCase())
  );

  const generateSummaries = async () => {
    const paths = Array.from(selected);
    if (!paths.length) return;

    try {
      const contents = await axios.post(
        `${baseURL}/api/github/files`,
        { owner, repo, files: paths },
        { withCredentials: true }
      );

      const resp = await axios.post(
        `${baseURL}/api/ai/summaries`,
        { framework: "jest", files: contents.data },
        { withCredentials: true }
      );

      setSummaries(resp.data);
    } catch (err) {
      console.error("❌ Failed to generate summaries:", err);
    }
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Filter files..."
        className="w-full border rounded p-2"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="h-80 overflow-auto border rounded p-2">
        {filtered.map((f) => (
          <label key={f.sha} className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={selected.has(f.path)}
              onChange={() => toggleFile(f.path)}
            />
            <span className="text-sm">{f.path}</span>
          </label>
        ))}
      </div>
      <button
        onClick={generateSummaries}
        className="w-full px-3 py-2 rounded bg-black text-white"
      >
        Generate Test Summaries
      </button>
    </div>
  );
}
