import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Car, PlusCircle, Ticket, Users } from "lucide-react";
import api from "../api/axios";
import RideCard from "../components/RideCard";
import StatCard from "../components/StatCard";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/rides/driver/my-rides")
      .then((res) => setRides(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const activeRides = rides.filter((ride) => ride.status !== "cancelled").length;
  const totalBookings = rides.reduce((sum, ride) => sum + (ride.bookings?.length || 0), 0);
  const totalSeats = rides.reduce((sum, ride) => sum + (ride.availableSeats || 0), 0);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading driver dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-slate-900 to-blue-800 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-100 font-semibold">Driver Dashboard</p>
              <h1 className="text-4xl font-extrabold mt-2">Manage your rides</h1>
              <p className="text-blue-100 mt-3">
                Create, track, and control all rides posted by you.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/driver/create-ride"
                className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-bold shadow hover:bg-blue-50 flex items-center gap-2"
              >
                <PlusCircle size={19} />
                Create Ride
              </Link>

              <Link
                to="/driver/my-rides"
                className="bg-blue-500 text-white px-5 py-3 rounded-2xl font-bold shadow hover:bg-blue-600"
              >
                My Rides
              </Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard title="Total Rides" value={rides.length} icon={Car} />
          <StatCard title="Active Rides" value={activeRides} icon={Calendar} />
          <StatCard title="Total Bookings" value={totalBookings} icon={Users} />
          <StatCard title="Available Seats" value={totalSeats} icon={Ticket} />
        </div>

        <section className="bg-white border rounded-3xl p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Recent Rides</h2>
            <p className="text-gray-500 text-sm">Your latest created rides.</p>
          </div>

          {rides.length === 0 ? (
            <div className="text-center py-14">
              <Car className="mx-auto text-gray-400 mb-3" size={44} />
              <h3 className="font-bold text-xl">No rides created yet</h3>
              <p className="text-gray-500 mt-1">Create your first ride and start accepting bookings.</p>
              <Link
                to="/driver/create-ride"
                className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold"
              >
                Create Ride
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {rides.slice(0, 4).map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}