import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          TestGen
        </Link>
        <div className="space-x-4">
          <Link to="/config" className="hover:underline">Repo Config</Link>
          <Link to="/results" className="hover:underline">Results</Link>
        </div>
      </div>
    </nav>
  );
}
