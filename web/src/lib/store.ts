// lib/store.ts
import { create } from "zustand";

interface Store {
  owner: string;
  repo: string;
  branch: string;
  generated: any;
  summaries: any[];
  selected: Set<string>;
  isAuthenticated: boolean;

  // New field to store repositories
  repos: any[];

  setAuthenticated: (auth: boolean) => void;
  setOwner: (o: string) => void;
  setRepo: (r: string) => void;
  setBranch: (b: string) => void;
  setGenerated: (g: any) => void;
  setSummaries: (s: any[]) => void;
  toggleFile: (f: string) => void;

  // Setter for repos array
  setRepos: (repos: any[]) => void;
}

export const useStore = create<Store>((set) => ({
  owner: "",
  repo: "",
  branch: "",
  generated: null,
  summaries: [],
  selected: new Set(),
  isAuthenticated: false,

  // Initialize repos as empty array
  repos: [],

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setOwner: (o) => set({ owner: o }),
  setRepo: (r) => set({ repo: r }),
  setBranch: (b) => set({ branch: b }),
  setGenerated: (g) => set({ generated: g }),
  setSummaries: (s) => set({ summaries: s }),
  toggleFile: (f) =>
    set((state) => {
      const newSelected = new Set(state.selected);
      if (newSelected.has(f)) {
        newSelected.delete(f);
      } else {
        newSelected.add(f);
      }
      return { selected: newSelected };
    }),

  setRepos: (repos) => set({ repos }),
}));
