import React, { useEffect, useState } from "react";
import RepoPicker from "../components/RepoPicker";
import BranchPicker from "../components/BranchPicker";
import FileTree from "../components/FileTree";
import SummariesList from "../components/SummariesList";
import CodeViewer from "../components/CodeViewer";
import CreatePRDialog from "../components/CreatePRDialog";
import { useStore } from "../lib/store";
import axios from "axios";

export default function MainApp() {
  const { generated, setAuthenticated, setRepos } = useStore();
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Step 1: Check if authenticated
    axios
      .get(`${baseURL}/api/github/me`, { withCredentials: true })
      .then((res) => {
        console.log("✅ Authenticated as:", res.data.login);
        setAuthenticated(true);
        setLoadingUser(false);

        // Step 2: Fetch user repos
        return axios.get(`${baseURL}/api/github/repos`, {
          withCredentials: true,
        });
      })
      .then((res) => {
        console.log("✅ Repos fetched:", res.data.length);
        setRepos(res.data);
        setLoadingRepos(false);
      })
      .catch((err) => {
        console.warn("🚫 Not authenticated or failed to fetch repos:", err);
        setAuthenticated(false);
        window.location.href = "/"; // redirect to login
      });
  }, [baseURL, setAuthenticated, setRepos]);

  if (loadingUser) return <div>Loading GitHub user...</div>;
  if (loadingRepos) return <div>Loading repositories...</div>;

  return (
    <div className="h-full grid grid-cols-12">
      <aside className="col-span-3 border-r p-3 space-y-3">
        <RepoPicker />
        <BranchPicker />
        <FileTree />
      </aside>
      <main className="col-span-5 p-3">
        <SummariesList />
      </main>
      <section className="col-span-4 border-l p-3 flex flex-col">
        <div className="flex-1">
          <CodeViewer />
        </div>
        <div className="pt-3">{generated && <CreatePRDialog />}</div>
      </section>
    </div>
  );
}
