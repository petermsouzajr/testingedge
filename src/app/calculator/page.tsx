'use client'; // Needed for potential future client-side interactions

import { useState } from 'react';

export default function CalculatorPage() {
  // Basic state placeholders, logic to be added later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Simulate API call - Replace with actual fetch to /api/login later
    console.log('Attempting login with:', username, password);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    // --- TODO: Replace with actual API call ---
    // Example placeholder logic:
    if (username === 'user' && password === 'pass') {
      setIsAuthenticated(true);
      console.log('Simulated Login Successful');
    } else {
      setError('Invalid credentials (use user/pass for demo)');
      setIsAuthenticated(false);
      console.log('Simulated Login Failed');
    }
    // --- End TODO ---

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError('');
    console.log('Logged out');
    // --- TODO: Call /api/logout later ---
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Internal Calculator Access
      </h1>

      {!isAuthenticated ? (
        // Login Form Container
        <div
          id="login-form"
          className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Login Required
          </h2>
          <form id="auth-form" onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p
                id="login-error"
                className="text-red-600 text-sm text-center mb-4"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        // Calculator Application Container
        <div
          id="calculator-app"
          className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4">Calculator</h2>
          <div className="bg-gray-100 p-6 rounded min-h-[200px] flex items-center justify-center text-gray-500">
            {/* ==== YOUR ACTUAL CALCULATOR INTERFACE/CONTENT GOES HERE ==== */}
            <p>Welcome! Calculator content will appear here.</p>
            {/* ================================================================ */}
          </div>
          <button
            id="logout-button"
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
