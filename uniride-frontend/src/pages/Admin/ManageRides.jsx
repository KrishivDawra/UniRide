import React, { useEffect, useState } from 'react';
import api from '../../api/axios';


export default function ManageUsers(){
const [users,setUsers] = useState([]);
useEffect(()=>{ api.get('/admin/users').then(r=>setUsers(r.data)).catch(()=>{}); },[]);


const suspend = async id => {
await api.patch(`/admin/user/${id}/suspend`);
setUsers(users.map(u=> u._id===id?{...u,suspended:true}:u));
};


return (
<div className="p-6 max-w-4xl mx-auto">
<h1 className="text-2xl font-bold">Manage Users</h1>
<div className="mt-4 space-y-3">
{users.map(u=> (
<div key={u._id} className="p-3 border rounded flex justify-between">
<div>
<p className="font-semibold">{u.name} ({u.role})</p>
<p>{u.email}</p>
</div>
<div>
<button onClick={()=>suspend(u._id)} className="bg-red-600 text-white px-3 py-1 rounded">Suspend</button>
</div>
</div>
))}
</div>
</div>
);
}