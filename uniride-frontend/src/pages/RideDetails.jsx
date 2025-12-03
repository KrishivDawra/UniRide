import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    api.get(`/rides/${id}`).then(r => setRide(r.data)).catch(() => {});
  }, [id]);

  const toggle = seatId => setSelected(prev =>
    prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
  );

  const handleBooking = async () => {
    if (selected.length === 0) return alert('Select at least one seat!');
    try {
      await api.post('/bookings', { rideId: ride._id, seats: selected });
      alert('Booking successful!');
      window.location.href = '/student';
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed');
    }
  };

  if (!ride) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{ride.from} → {ride.to}</h1>
      <p className="mb-4">{new Date(ride.time).toLocaleString()}</p>

      <div className="grid grid-cols-4 gap-3">
        {ride.seatBreakdown.map(s => (
          <button
            key={s.seatId}
            disabled={!s.available}
            onClick={() => toggle(s.seatId)}
            className={`p-3 border rounded ${s.available ? 'bg-green-200' : 'bg-gray-300'} ${selected.includes(s.seatId) ? 'bg-blue-300' : ''}`}
          >
            {s.seatId}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <button onClick={handleBooking} className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Selected
        </button>
      </div>
    </div>
  );
}
