import axios from "axios";
import { GITHUB_TOKEN } from "../config";

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
});

export default {
  async getRepoFiles(owner: string, repo: string, path: string = "") {
    const url = `/repos/${owner}/${repo}/contents/${path}`;
    const { data } = await api.get(url);
    return data;
  },
};
