import React, { useEffect, useState } from 'react';
import api from '../../api/axios';


export default function ManageBookings(){
const [bookings,setBookings] = useState([]);
useEffect(()=>{ api.get('/admin/bookings').then(r=>setBookings(r.data)).catch(()=>{}); },[]);


return (
<div className="p-6 max-w-5xl mx-auto">
<h1 className="text-2xl font-bold">Manage Bookings</h1>
<div className="mt-4 space-y-3">
{bookings.map(b=> (
<div key={b._id} className="p-3 border rounded">
<p>{b.user?.name} booked {b.seats.join(', ')} on {b.ride?.from} → {b.ride?.to}</p>
<p>Status: {b.status}</p>
</div>
))}
</div>
</div>
);
}