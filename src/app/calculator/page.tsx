'use client'; // This page will involve client-side logic for auth checking

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import router for redirection

export default function CalculatorPage() {
  // State variables
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking, false = not auth, true = auth
  const [isLoading, setIsLoading] = useState(false); // For login form submission
  const [error, setError] = useState(''); // To display login errors
  const router = useRouter(); // Initialize router

  // 1. Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) {
          // Handle non-200 responses if needed, but typically means not authenticated
          console.error('Auth check failed with status:', response.status);
          setIsAuthenticated(false);
          return;
        }
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setIsAuthenticated(false); // Assume not authenticated on error
      }
    };

    checkAuth();
  }, []); // Empty dependency array means run once on mount

  // 2. Handle login form submission
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Attempt to parse error message from server if available
        let errorMessage = 'Login failed. Please check credentials.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch /* _jsonError */ {
          // Remove unused variable from catch
          // Ignore if response body isn't valid JSON
          console.warn('Could not parse error response from login API.');
        }
        throw new Error(errorMessage);
      }

      // Successful login
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.error('Login error:', err);
      // Type check before accessing message property
      let displayError = 'An error occurred during login.';
      if (err instanceof Error) {
        displayError = err.message;
      }
      setError(displayError);
      setIsAuthenticated(false); // Ensure state reflects failed login
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint (we'll create this next)
      await fetch('/api/logout', { method: 'POST' }); // Use POST as it changes state
    } catch (err) {
      console.error('Error during logout API call:', err);
      // Proceed with logout on client-side even if API fails
    }
    // Update state and redirect
    setIsAuthenticated(false);
    router.push('/'); // Redirect to homepage
  };

  // Render loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Checking authentication...</p>
        {/* Optional: Add a spinner here */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 w-full">
      <main className="w-full max-w-[50rem] py-12 mb-28">
        {/* Header section with conditional Logout button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Internal Calculator</h1>
          {isAuthenticated && ( // Only show button when authenticated
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          /* Login Form Container */
          <div id="login-form">
            <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
            <form id="auth-form" onSubmit={handleLogin} className="space-y-4">
              <div>
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  disabled={isLoading}
                />
              </div>
              <div>
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p id="login-error" className="text-red-600 text-sm">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        ) : (
          /* Calculator Application Container */
          <div id="calculator-app">
            <h2 className="text-2xl font-semibold mb-4">Calculator</h2>
            <div className="bg-gray-100 p-6 rounded min-h-[200px] flex items-center justify-center text-gray-500">
              {/* ==== YOUR ACTUAL CALCULATOR INTERFACE/CONTENT GOES HERE ==== */}
              <p>Welcome! Calculator content will appear here.</p>
              {/* ================================================================ */}
            </div>
            {/* TODO: Implement Logout Button and functionality if needed */}
          </div>
        )}
      </main>
    </div>
  );
}
