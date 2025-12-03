import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import RideCard from '../components/RideCard';


export default function Home(){
const [rides,setRides] = useState([]);
useEffect(()=>{ api.get('/rides').then(r=>setRides(r.data)).catch(()=>{}); },[]);


return (
<div className="p-6 max-w-5xl mx-auto">
<h1 className="text-2xl font-bold mb-4">Available Rides</h1>
<div className="grid grid-cols-1 gap-4">
{rides.map(r => <RideCard key={r._id} ride={r} />)}
</div>
</div>
);
}