import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import RideCard from '../components/RideCard';

export default function StudentDashboard() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    api.get('/rides')
      .then(r => setRides(r.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Available Rides</h1>

        <Link
          to="/student/bookings"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          My Bookings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rides.length === 0 && <p>No rides available</p>}
        {rides.map(r => <RideCard key={r._id} ride={r} />)}
      </div>
    </div>
  );
}