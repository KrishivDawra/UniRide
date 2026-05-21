import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const suspend = async (id) => {
    if (!window.confirm('Suspend this user?')) return;

    try {
      const res = await api.patch(`/admin/user/${id}/suspend`);

      setUsers(prev =>
        prev.map(u =>
          u._id === id ? res.data.user || { ...u, suspended: true } : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to suspend user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {u.name} ({u.role})
                </p>
                <p>{u.email}</p>
                <p>{u.mobile}</p>
                <p>Status: {u.suspended ? 'Suspended' : 'Active'}</p>
              </div>

              {!u.suspended && (
                <button
                  onClick={() => suspend(u._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Suspend
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}