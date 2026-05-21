import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    try {
      const res = await api.get('/admin/rides');
      setRides(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (id) => {
    if (!window.confirm('Cancel this ride?')) return;

    try {
      await api.patch(`/admin/rides/${id}/cancel`);

      setRides(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: 'cancelled' } : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to cancel ride');
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  if (loading) return <p className="p-6">Loading rides...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Rides</h1>

      {rides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <div className="space-y-3">
          {rides.map(r => (
            <div key={r._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {r.from} → {r.to}
                </p>
                <p>Driver: {r.postedByName || r.postedBy?.name || 'Unknown'}</p>
                <p>Vehicle: {r.vehicleType}</p>
                <p>Available Seats: {r.availableSeats}</p>
                <p>Price: ₹{r.seatPrice}</p>
                <p>Status: {r.status}</p>
              </div>

              {r.status !== 'cancelled' && (
                <button
                  onClick={() => cancelRide(r._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}