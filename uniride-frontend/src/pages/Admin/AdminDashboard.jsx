import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 space-y-3">
        <Link to="/admin/users" className="block p-3 border rounded">Manage Users</Link>
        <Link to="/admin/rides" className="block p-3 border rounded">Manage Rides</Link>
        <Link to="/admin/bookings" className="block p-3 border rounded">Manage Bookings</Link>
      </div>
    </div>
  );
}
