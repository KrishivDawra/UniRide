import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;

    try {
      await api.patch(`/admin/bookings/${id}/cancel`);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {b.user?.name || 'Unknown User'} booked {b.seats?.join(', ') || 'N/A'}
                </p>

                <p>
                  Ride: {b.ride?.from || 'N/A'} → {b.ride?.to || 'N/A'}
                </p>

                <p>Status: {b.status}</p>
                <p>Payment: {b.paymentStatus}</p>
                <p>Amount: ₹{b.amount}</p>
              </div>

              {b.status === 'booked' && (
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
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