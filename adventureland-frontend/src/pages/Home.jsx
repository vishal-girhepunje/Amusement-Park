import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary-900 mb-4">
            🎢 Welcome to AdventureLand Village
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your Ultimate Amusement Park Experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">👤 Customer</h2>
            <p className="text-gray-600 mb-6">
              Book tickets, explore activities, and manage your bookings. Experience the thrill
              of our amazing attractions!
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Register as Customer
              </Link>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">👨‍💼 Admin</h2>
            <p className="text-gray-600 mb-6">
              Manage activities, view customer details, and oversee park operations. Keep
              everything running smoothly!
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Register as Admin
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎫</div>
              <h3 className="font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">Book tickets for multiple activities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎡</div>
              <h3 className="font-semibold mb-2">Amazing Rides</h3>
              <p className="text-sm text-gray-600">Explore our thrilling attractions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-gray-600">JWT-based authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

