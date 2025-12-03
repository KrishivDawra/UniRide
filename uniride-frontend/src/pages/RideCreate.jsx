import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function RideCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: '',
    to: '',
    time: '',
    seats: 4,
    seatPrice: 50,
    pickupGeo: { type: 'Point', coordinates: [0, 0] },
    dropGeo: { type: 'Point', coordinates: [0, 0] },
  });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in as a driver!');

    try {
      await api.post(
        '/rides',
        {
          from: form.from,
          to: form.to,
          time: form.time,
          vehicleType: 'car',
          seats: Number(form.seats),
          seatPrice: Number(form.seatPrice),
          pickupGeo: form.pickupGeo,
          dropGeo: form.dropGeo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // include JWT token
          },
        }
      );

      alert('Ride created successfully!');
      navigate('/driver/dashboard'); // redirect to driver dashboard
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || 'Ride creation failed');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Ride</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          name="from"
          placeholder="From"
          onChange={handle}
          className="w-full p-2 border"
        />
        <input
          name="to"
          placeholder="To"
          onChange={handle}
          className="w-full p-2 border"
        />
        <input
          name="time"
          type="datetime-local"
          onChange={handle}
          className="w-full p-2 border"
        />
        <input
          name="seats"
          type="number"
          placeholder="Seats"
          defaultValue={4}
          onChange={handle}
          className="w-full p-2 border"
        />
        <input
          name="seatPrice"
          type="number"
          placeholder="Seat Price"
          defaultValue={50}
          onChange={handle}
          className="w-full p-2 border"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Create Ride
        </button>
      </form>
    </div>
  );
}
