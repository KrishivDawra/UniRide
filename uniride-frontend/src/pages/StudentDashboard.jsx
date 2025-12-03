import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import RideCard from '../components/RideCard';

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    api.get('/bookings/user').then(r => setBookings(r.data)).catch(() => {});
    api.get('/rides').then(r => setRides(r.data)).catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Available Rides</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rides.length === 0 && <p>No rides available</p>}
        {rides.map(r => <RideCard key={r._id} ride={r} />)}
      </div>

      <h1 className="text-2xl font-bold mt-8">Your Bookings</h1>
      <div className="mt-4 space-y-3">
        {bookings.length === 0 && <p>No bookings yet.</p>}
        {bookings.map(b => (
          <div key={b._id} className="p-3 border rounded">
            <p>{b.ride.from} → {b.ride.to}</p>
            <p>Seats: {b.seats.join(', ')}</p>
            <p>Status: {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
