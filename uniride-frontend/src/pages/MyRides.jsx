import React, { useEffect, useState } from "react";
import { Calendar, Car, IndianRupee, Ticket, Users, XCircle } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRides = async () => {
    try {
      const res = await api.get("/rides/driver/my-rides");
      setRides(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (rideId) => {
    if (!window.confirm("Cancel this ride?")) return;

    try {
      await api.patch(`/rides/${rideId}/cancel`);
      fetchMyRides();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel ride");
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading rides...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Rides</h1>
          <p className="text-gray-500 mt-1">Manage rides created by you.</p>
        </div>

        {rides.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center shadow-sm">
            <Car className="mx-auto text-gray-400 mb-4" size={42} />
            <h2 className="text-xl font-bold">No rides created yet</h2>
            <p className="text-gray-500 mt-2">Create your first ride to start accepting bookings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {rides.map((ride) => (
              <div key={ride._id} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{ride.from} → {ride.to}</h2>
                    <p className="text-sm text-gray-500 mt-1">Ride ID: {ride._id.slice(-6).toUpperCase()}</p>
                  </div>

                  <StatusBadge status={ride.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <Info icon={Calendar} label="Time" value={new Date(ride.time).toLocaleString()} />
                  <Info icon={Car} label="Vehicle" value={ride.vehicleType} />
                  <Info icon={Ticket} label="Available Seats" value={`${ride.availableSeats}/${ride.seats}`} />
                  <Info icon={IndianRupee} label="Seat Price" value={`₹${ride.seatPrice}`} />
                  <Info icon={Users} label="Bookings" value={ride.bookings?.length || 0} />
                </div>

                {ride.status !== "cancelled" && (
                  <button
                    onClick={() => cancelRide(ride._id)}
                    className="mt-5 w-full bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition flex justify-center items-center gap-2"
                  >
                    <XCircle size={18} />
                    Cancel Ride
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3">
      <p className="text-gray-500 flex items-center gap-2">
        <Icon size={16} />
        {label}
      </p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}