import React from "react";
import RepoPicker from "../components/RepoPicker";
import BranchPicker from "../components/BranchPicker";
import FileTree from "../components/FileTree";
import SummariesList from "../components/SummariesList";
import CodeViewer from "../components/CodeViewer";
import CreatePRDialog from "../components/CreatePRDialog";
import { useStore } from "../lib/store";

export default function Home() {
  const { generated } = useStore();
  return (
    <div className="h-full grid grid-cols-12 min-h-[80vh]">
      <aside className="col-span-3 border-r p-3 space-y-3 bg-white">
        <RepoPicker />
        <BranchPicker />
        <FileTree />
      </aside>
      <main className="col-span-5 p-3 bg-white">
        <SummariesList />
      </main>
      <section className="col-span-4 border-l p-3 flex flex-col bg-white">
        <div className="flex-1 overflow-auto">
          <CodeViewer />
        </div>
        <div className="pt-3">{generated && <CreatePRDialog />}</div>
      </section>
    </div>
  );
}

