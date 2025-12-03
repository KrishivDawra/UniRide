import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RideCard({ ride }) {
  const navigate = useNavigate();
  return (
    <div className="border p-4 rounded shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{ride.from} → {ride.to}</h3>
          <p>When: {new Date(ride.time).toLocaleString()}</p>
          <p>Seats available: {ride.availableSeats}</p>
        </div>
        <div className="text-right">
          <p>Price: ₹{ride.seatPrice}</p>
          <Link
            to={`/ride/${ride._id}`}
            className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded"
          >
            View / Book
          </Link>
        </div>
      </div>
    </div>
  );
}
