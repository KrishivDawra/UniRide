import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRides = async () => {
    try {
      const res = await api.get('/rides/driver/my-rides');
      setRides(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (rideId) => {
    try {
      await api.patch(`/rides/${rideId}/cancel`);
      alert('Ride cancelled');
      fetchMyRides();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to cancel ride');
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  if (loading) return <p className="p-6">Loading rides...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Rides</h2>

      {rides.length === 0 ? (
        <p>No rides created yet.</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride._id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">
                {ride.from} → {ride.to}
              </h3>

              <p>Time: {new Date(ride.time).toLocaleString()}</p>
              <p>Vehicle: {ride.vehicleType}</p>
              <p>Total Seats: {ride.seats}</p>
              <p>Available Seats: {ride.availableSeats}</p>
              <p>Seat Price: ₹{ride.seatPrice}</p>
              <p>Status: {ride.status}</p>
              <p>Total Bookings: {ride.bookings?.length || 0}</p>

              {ride.status !== 'cancelled' && (
                <button
                  onClick={() => cancelRide(ride._id)}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel Ride
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}