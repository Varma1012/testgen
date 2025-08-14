import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../lib/store";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setOwner = useStore((s) => s.setOwner);
  const setRepo = useStore((s) => s.setRepo);
  const setBranch = useStore((s) => s.setBranch);
  const setAuthenticated = useStore((s) => s.setAuthenticated);

  useEffect(() => {
    const owner = params.get("owner");
    const repo = params.get("repo");
    const branch = params.get("branch");

    if (owner && repo && branch) {
      setOwner(owner);
      setRepo(repo);
      setBranch(branch);
      setAuthenticated(true);
      navigate("/"); // or wherever your main app is
    } else {
      console.error("Missing auth data in callback");
      navigate("/");
    }
  }, []);

  return <p>Logging in...</p>;
}
