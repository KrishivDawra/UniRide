import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/user');
      setBookings(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="p-6">Loading bookings...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">
                {booking.ride?.from} → {booking.ride?.to}
              </h3>

              <p>Time: {new Date(booking.ride?.time).toLocaleString()}</p>
              <p>Seats: {booking.seats.join(', ')}</p>
              <p>Amount: ₹{booking.amount}</p>
              <p>Status: {booking.status}</p>
              <p>Payment: {booking.paymentStatus}</p>

              {booking.driver && (
                <p>
                  Driver: {booking.driver.name} | {booking.driver.mobile}
                </p>
              )}

              {booking.status === 'booked' && (
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}