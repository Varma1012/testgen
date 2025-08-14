import TestResultCard from "../components/TestResultCard";

export default function TestResults() {
  // Placeholder example results
  const results = [
    { file: "utils/math.js", status: "success" },
    { file: "controllers/user.js", status: "pending" },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Test Results</h1>
      <div className="space-y-3">
        {results.map((r, idx) => (
          <TestResultCard key={idx} file={r.file} status={r.status} />
        ))}
      </div>
    </div>
  );
}
