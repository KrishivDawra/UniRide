import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Manage Bookings</h1>
      <div className="mt-4 space-y-3">
        {bookings.map(b => (
          <div key={b._id} className="p-3 border rounded flex justify-between">
            <div>
              <p>{b.user?.name} booked {b.seats.join(', ')} on {b.ride?.from} → {b.ride?.to}</p>
              <p>Status: {b.status}</p>
            </div>
            <div>
              {b.status === 'booked' && (
                <button 
                  onClick={() => cancelBooking(b._id)} 
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
