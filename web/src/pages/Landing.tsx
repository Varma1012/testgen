import React from 'react';

export default function Landing() {
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/github/login`;
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-semibold">TestGen</h1>
        <p className="text-gray-600">
          Connect your GitHub and generate AI-powered test cases.
        </p>
        <button
          onClick={login}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
}
