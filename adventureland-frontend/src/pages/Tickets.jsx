import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketAPI, activityAPI } from '../services/api';
import { toast } from 'react-toastify';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState('');
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
      const [ticketsRes, activitiesRes] = await Promise.all([
        ticketAPI.getByCustomer(user.customerId),
        activityAPI.getAll(),
      ]);
      setTickets(Array.from(ticketsRes.data || []));
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async () => {
    if (!selectedActivity) {
      toast.error('Please select an activity');
      return;
    }

    if (!bookingDate || !bookingTime) {
      toast.error('Please select both date and time');
      return;
    }

    // Combine date and time into ISO format
    const dateTimeString = `${bookingDate}T${bookingTime}:00`;

    try {
      await ticketAPI.book(selectedActivity, dateTimeString);
      toast.success('Ticket booked successfully!');
      setSelectedActivity('');
      setBookingDate('');
      setBookingTime('');
      fetchData();
    } catch (error) {
      toast.error('Failed to book ticket');
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      await ticketAPI.cancel(ticketId);
      toast.success('Ticket cancelled successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel ticket');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">My Tickets</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Book New Ticket</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Activity
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => {
                setSelectedActivity(e.target.value);
                // Set default date/time when activity is selected
                if (e.target.value && !bookingDate) {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(10, 0, 0, 0);
                  setBookingDate(tomorrow.toISOString().split('T')[0]);
                  setBookingTime('10:00');
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select an activity</option>
              {activities.map((activity) => (
                <option key={activity.activityId} value={activity.activityId}>
                  {activity.description} - ₹{activity.charges}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
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
          
          <button
            onClick={handleBookTicket}
            className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Book Ticket
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className={`bg-white rounded-lg shadow-lg p-6 ${
                ticket.isCancelled ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Ticket #{ticket.ticketId}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Activity:</span>{' '}
                    {ticket.activities?.description || 'N/A'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Date:</span>{' '}
                    {formatDate(ticket.dateTime)}
                  </p>
                  <p className="text-primary-600 font-bold text-lg">
                    ₹{ticket.activities?.charges || '0'}
                  </p>
                  {ticket.isCancelled && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold">
                      Cancelled
                    </span>
                  )}
                </div>
                {!ticket.isCancelled && (
                  <button
                    onClick={() => handleCancelTicket(ticket.ticketId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
            <div className="text-4xl mb-4">🎫</div>
            <p className="text-xl">No tickets yet</p>
            <p className="text-sm mt-2">Book your first ticket above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;

