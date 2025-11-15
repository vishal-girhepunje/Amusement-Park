import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activityAPI, customerAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activities: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [activitiesRes, customersRes] = await Promise.all([
        activityAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setStats({
        activities: activitiesRes.data?.length || 0,
        customers: customersRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-800 mb-2">
          Welcome, {user?.userName || 'Admin'}!
        </h1>
        <p className="text-gray-600">Manage your amusement park operations</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {stats.activities}
          </div>
          <div className="text-gray-600">Total Activities</div>
          <Link
            to="/activities"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 text-sm font-semibold"
          >
            Manage Activities →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {stats.customers}
          </div>
          <div className="text-gray-600">Total Customers</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-3xl font-bold text-primary-600 mb-2">🎢</div>
          <div className="text-gray-600">Park Status</div>
          <div className="mt-2 text-green-600 font-semibold">Operational</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/activities"
            className="p-4 border-2 border-primary-200 rounded-lg hover:border-primary-500 transition text-center"
          >
            <div className="text-2xl mb-2">🎡</div>
            <div className="font-semibold">Manage Activities</div>
            <div className="text-sm text-gray-600">Add, update, or delete activities</div>
          </Link>
          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold">View Customers</div>
            <div className="text-sm text-gray-600">Manage customer information</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

