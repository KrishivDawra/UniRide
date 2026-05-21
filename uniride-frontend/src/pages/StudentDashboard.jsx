import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Car, Search, Ticket } from "lucide-react";
import api from "../api/axios";
import RideCard from "../components/RideCard";
import StatCard from "../components/StatCard";

export default function StudentDashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/rides")
      .then((res) => setRides(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const text = `${ride.from} ${ride.to} ${ride.vehicleType}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [rides, search]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading available rides...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-100 font-semibold">Student Dashboard</p>
              <h1 className="text-4xl font-extrabold mt-2">Find your next ride</h1>
              <p className="text-blue-100 mt-3">
                Search, select seats, and manage your college travel easily.
              </p>
            </div>

            <Link
              to="/student/bookings"
              className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-bold shadow hover:bg-blue-50"
            >
              My Bookings
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Available Rides" value={rides.length} icon={Car} />
          <StatCard
            title="Total Seats"
            value={rides.reduce((sum, ride) => sum + (ride.availableSeats || 0), 0)}
            icon={Ticket}
          />
          <StatCard title="Upcoming Today" value={rides.length} icon={Calendar} />
        </div>

        <section className="bg-white border rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold">Available Rides</h2>
              <p className="text-gray-500 text-sm">Choose from currently open rides.</p>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search from, to, vehicle..."
                className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredRides.length === 0 ? (
            <div className="text-center py-14">
              <Car className="mx-auto text-gray-400 mb-3" size={44} />
              <h3 className="font-bold text-xl">No rides found</h3>
              <p className="text-gray-500 mt-1">Try changing your search or check later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}