import React from "react";
import { useStore } from "../lib/store";

export default function RepoPicker() {
  const { owner, repo, setOwner, setRepo, repos } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [o, r] = e.target.value.split("/");
    console.log("📌 Selected repo:", o, r); // debug
    setOwner(o);
    setRepo(r);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">Repository</label>
      <select
        className="w-full border rounded p-2"
        value={repo ? `${owner}/${repo}` : ""}
        onChange={handleChange}
      >
        <option value="">Select…</option>
        {Array.isArray(repos) &&
          repos.map((r: any) => (
            <option key={r.id} value={`${r.owner.login}/${r.name}`}>
              {r.full_name}
            </option>
          ))}
      </select>
    </div>
  );
}
