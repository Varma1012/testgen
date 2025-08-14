interface Props {
  file: string;
  status: string;
}

export default function TestResultCard({ file, status }: Props) {
  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <p className="font-medium">{file}</p>
      <p className={`text-sm ${status === "success" ? "text-green-600" : "text-yellow-600"}`}>
        {status}
      </p>
    </div>
  );
}
