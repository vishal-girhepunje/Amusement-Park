import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🎢 AdventureLand Village</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded hover:bg-primary-700 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/activities"
                  className="px-4 py-2 rounded hover:bg-primary-700 transition"
                >
                  Activities
                </Link>
                {!isAdmin && (
                  <Link
                    to="/tickets"
                    className="px-4 py-2 rounded hover:bg-primary-700 transition"
                  >
                    My Tickets
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Welcome, {user?.userName || user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded hover:bg-primary-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-400 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

