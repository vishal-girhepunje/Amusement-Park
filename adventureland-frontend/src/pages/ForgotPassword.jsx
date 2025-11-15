import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    mobileNumber: '',
    userType: 'CUSTOMER',
    resetMethod: 'email', // 'email' or 'mobile'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        userType: formData.userType,
      };

      if (formData.resetMethod === 'email') {
        if (!formData.email) {
          toast.error('Please enter your email address');
          setLoading(false);
          return;
        }
        requestData.email = formData.email;
      } else {
        if (!formData.mobileNumber) {
          toast.error('Please enter your mobile number');
          setLoading(false);
          return;
        }
        requestData.mobileNumber = formData.mobileNumber;
      }

      await authAPI.forgotPassword(requestData);
      toast.success('OTP has been sent! Please check your email/mobile.');
      
      // Navigate to reset password page with the data
      navigate('/reset-password', {
        state: {
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          userType: formData.userType,
          resetMethod: formData.resetMethod,
        },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email or mobile number to receive an OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reset Method
            </label>
            <select
              value={formData.resetMethod}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  resetMethod: e.target.value,
                  email: '',
                  mobileNumber: '',
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={formData.userType === 'ADMIN'}
            >
              <option value="email">Email</option>
              <option value="mobile">Mobile Number</option>
            </select>
            {formData.userType === 'ADMIN' && (
              <p className="text-xs text-gray-500 mt-1">Admin can only reset via email</p>
            )}
          </div>

          {formData.resetMethod === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your registered email"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your registered mobile number"
                pattern="[6-9][0-9]{9}"
                maxLength="10"
              />
              <p className="text-xs text-gray-500 mt-1">10 digits starting with 6-9</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

