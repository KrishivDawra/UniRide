import React from 'react';


export default function AdminDashboard(){
return (
<div className="p-6 max-w-4xl mx-auto">
<h1 className="text-2xl font-bold">Admin Dashboard</h1>
<div className="mt-6 space-y-3">
<a href="/admin/users" className="block p-3 border rounded">Manage Users</a>
<a href="/admin/rides" className="block p-3 border rounded">Manage Rides</a>
<a href="/admin/bookings" className="block p-3 border rounded">Manage Bookings</a>
</div>
</div>
);
}