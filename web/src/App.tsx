import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MainApp from "./pages/MainApp";

import TestResults from "./pages/TextResults";  // fixed typo TextResults -> TestResults
import Landing from "./pages/Landing";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
    
        <Route path="/app" element={<MainApp />}/>
      </Routes>
    </div>
  );
}
