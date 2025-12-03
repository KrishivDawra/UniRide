import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import RideCard from '../components/RideCard';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    api.get('/drivers/my-rides')
      .then(res => setRides(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        {/* Correct route */}
        <Link 
          to="/driver/create-ride" 
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Create Ride
        </Link>
      </div>

      {rides.length === 0 ? (
        <p className="text-gray-500">No rides created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.map(r => <RideCard key={r._id} ride={r} />)}
        </div>
      )}
    </div>
  );
}
