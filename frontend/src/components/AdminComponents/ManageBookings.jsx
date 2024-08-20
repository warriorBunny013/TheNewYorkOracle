import React, { useState, useEffect } from 'react';
import { API_URL } from '../../utils/apiConfig';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  // Function to fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Function to update booking status
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/booking/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    updateBookingStatus(id, newStatus);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <div className="badge badge-error">Pending</div>;
      case 'booked':
        return <div className="badge badge-warning">Booked</div>;
      case 'completed':
        return <div className="badge badge-success">Completed</div>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
        Bookings
      </div>
      <div className="min-w-full">
        <table className="table min-w-full">
          {/* head */}
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2">#</th>
              <th className="p-2">UserName</th>
              <th className="p-2">UserEmail</th>
              <th className="p-2">UserPhone</th>
              <th className="p-2">Type</th>
              <th className="p-2">Title</th>
              <th className="p-2">Price</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.bookingId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <th className="p-2">{index + 1}</th>
                <td className="p-2">{booking.userName}</td>
                <td className="p-2">{booking.userEmail}</td>
                <td className="p-2">{booking.userPhone}</td>
                <td className="p-2">{booking.products[0]?.alt || 'N/A'}</td>
                <td className="p-2">{booking.products[0]?.title || 'N/A'}</td>
                <td className="p-2">{booking.products[0]?.price || 'N/A'}</td>
                <td className="p-2 flex items-center gap-2">
                  {getStatusBadge(booking.status)}
                  <select
                    className="select select-bordered select-sm"
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBookings;
