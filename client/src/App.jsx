import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing";

function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const checkAuth = () => setIsAuthed(!!localStorage.getItem("token"));
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);
  return isAuthed;
}

function Shell({ children, isAuthed }) {
  const nav = useNavigate();
  const out = () => {
    localStorage.removeItem("token");
    try { localStorage.removeItem("user"); } catch { }
    window.dispatchEvent(new Event("authChange"));
    nav("/", { replace: true });
  };

  let userName = "";
  try { userName = JSON.parse(localStorage.getItem("user") || "null")?.name || ""; } catch { }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Ledgerlite
                </h1>
              </div>
              
              {isAuthed && (
                <nav className="hidden md:flex space-x-1">
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analytics"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Analytics
                  </Link>
                </nav>
              )}
            </div>

            {/* Right section - User info and actions */}
            <div className="flex items-center space-x-4">
              {userName && (
                <div className="hidden sm:flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {userName}
                  </span>
                </div>
              )}
              
              {isAuthed && (
                <button
                  onClick={out}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}

              {/* Mobile menu button */}
              {isAuthed && (
                <div className="md:hidden">
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile navigation menu */}
          {isAuthed && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Analytics
                </Link>
                {userName && (
                  <div className="px-3 py-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {userName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const isAuthed = useAuth();

  return (
    <Routes>
      {/* Public landing */}
      <Route
        path="/"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Landing />}
      />

      {/* Auth pages */}
      <Route
        path="/login"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Shell isAuthed={isAuthed}><Login /></Shell>}
      />
      <Route
        path="/register"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Shell isAuthed={isAuthed}><Register /></Shell>}
      />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={isAuthed ? <Shell isAuthed={isAuthed}><Dashboard /></Shell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/analytics"
        element={isAuthed ? <Shell isAuthed={isAuthed}><Analytics /></Shell> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace /> } />
    </Routes>
  );
}
