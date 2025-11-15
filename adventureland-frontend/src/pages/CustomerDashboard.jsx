import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activityAPI, ticketAPI } from '../services/api';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Helper function to parse date from backend format (dd-MM-yyyy HH:mm:ss)
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // If it's already a valid Date object or ISO string, use it directly
    if (dateString instanceof Date && !isNaN(dateString)) {
      return dateString;
    }
    
    // Try parsing ISO format first
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    
    // Parse custom format: dd-MM-yyyy HH:mm:ss
    const match = dateString.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, day, month, year, hour, minute, second] = match;
      return new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
    }
    
    return null;
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activitiesRes, ticketsRes] = await Promise.all([
        activityAPI.getAll(),
        ticketAPI.getByCustomer(user.customerId),
      ]);
      setActivities(activitiesRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicketClick = (activity) => {
    setSelectedActivity(activity);
    setShowBookingModal(true);
    // Set default date/time (tomorrow at 10:00 AM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('10:00');
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast.error('Please select both date and time');
      return;
    }

    // Combine date and time into ISO format
    const dateTimeString = `${bookingDate}T${bookingTime}:00`;
    
    try {
      await ticketAPI.book(selectedActivity.activityId, dateTimeString);
      toast.success('Ticket booked successfully!');
      setShowBookingModal(false);
      setSelectedActivity(null);
      setBookingDate('');
      setBookingTime('');
      fetchData();
    } catch (error) {
      toast.error('Failed to book ticket');
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedActivity(null);
    setBookingDate('');
    setBookingTime('');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-800 mb-2">
          Welcome, {user?.userName || 'Customer'}!
        </h1>
        <p className="text-gray-600">Manage your bookings and explore activities</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
          {tickets && tickets.length > 0 ? (
            <div className="space-y-4">
              {Array.from(tickets).slice(0, 3).map((ticket) => (
                <div key={ticket.ticketId} className="border rounded-lg p-4">
                  <p className="font-semibold">Ticket #{ticket.ticketId}</p>
                  <p className="text-sm text-gray-600">
                    Activity: {ticket.activities?.description || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(ticket.dateTime)}
                  </p>
                  <p className="text-sm text-primary-600 font-semibold">
                    Amount: ₹{ticket.activities?.charges || '0'}
                  </p>
                  {ticket.isCancelled && (
                    <span className="text-red-500 text-sm">Cancelled</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tickets yet</p>
          )}
          <Link
            to="/tickets"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All Tickets →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Available Activities</h2>
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.activityId} className="border rounded-lg p-4">
                  <p className="font-semibold">{activity.description || 'Activity'}</p>
                  <p className="text-primary-600 font-bold">₹{activity.charges}</p>
                  <button
                    onClick={() => handleBookTicketClick(activity)}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No activities available</p>
          )}
          <Link
            to="/activities"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All Activities →
          </Link>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Book Ticket</h2>
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">
                {selectedActivity.description}
              </p>
              <p className="text-primary-600 font-bold">
                Price: ₹{selectedActivity.charges}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

