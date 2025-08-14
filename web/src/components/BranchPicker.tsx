import React from "react";
import axios from "axios";
import { useStore } from "../lib/store";

export default function BranchPicker() {
  const { owner, repo, branch, setBranch } = useStore();
  const [branches, setBranches] = React.useState<any[]>([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  React.useEffect(() => {
    console.log("🔍 BranchPicker owner/repo:", owner, repo);
    if (!owner || !repo) return;

    axios
      .get(`${baseURL}/api/github/branches`, {
        withCredentials: true,
        params: { owner, repo },
      })
      .then((r) => {
        console.log("✅ Branches fetched:", r.data);
        setBranches(r.data);
      })
      .catch((err) =>
        console.error("❌ Failed to fetch branches:", err.response || err)
      );
  }, [owner, repo, baseURL]);

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">Branch</label>
      <select
        className="w-full border rounded p-2"
        value={branch || ""}
        onChange={(e) => setBranch(e.target.value)}
      >
        <option value="">Select…</option>
        {branches.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
