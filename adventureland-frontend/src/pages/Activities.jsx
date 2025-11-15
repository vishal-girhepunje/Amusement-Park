import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { activityAPI } from '../services/api';
import { toast } from 'react-toastify';

const Activities = () => {
  const { isAdmin } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    charges: '',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activityAPI.create(formData);
      toast.success('Activity created successfully!');
      setShowForm(false);
      setFormData({ description: '', charges: '' });
      fetchActivities();
    } catch (error) {
      toast.error('Failed to create activity');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary-800">Activities</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Activity</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter activity description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charges (₹)
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter charges"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create Activity
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.activityId}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-2">{activity.description || 'Activity'}</h3>
              <p className="text-2xl font-bold text-primary-600 mb-4">₹{activity.charges}</p>
              <div className="text-sm text-gray-500">
                Activity ID: {activity.activityId}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            No activities available
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;

