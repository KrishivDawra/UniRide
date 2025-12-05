import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageRides() {
  const [rides, setRides] = useState([]);

  const fetchRides = async () => {
    try {
      const res = await api.get('/admin/rides'); // get all rides for admin
      setRides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRide = async (id) => {
    if (!window.confirm("Cancel this ride?")) return;
    try {
      await api.delete(`/rides/${id}`);
      setRides(rides.filter(r => r._id !== id));
    } catch (err) {
      alert('Failed to cancel ride');
    }
  };

  useEffect(() => { fetchRides(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Manage Rides</h1>
      <div className="mt-4 space-y-3">
        {rides.map(r => (
          <div key={r._id} className="p-3 border rounded flex justify-between">
            <div>
              <p>{r.from} → {r.to}</p>
              <p>Driver: {r.postedByName}</p>
              <p>Seats: {r.availableSeats}</p>
            </div>
            <div>
              <button 
                onClick={() => cancelRide(r._id)} 
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
