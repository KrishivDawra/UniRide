import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Car,
  IndianRupee,
  MapPin,
  Ticket,
  UserRound,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RideCard({ ride }) {
  return (
    <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-500" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative flex justify-between items-start gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-widest text-blue-600 mb-3 uppercase">
            Available Ride
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/25 text-white shrink-0">
              <MapPin size={18} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              {ride.from} <span className="text-slate-400">→</span> {ride.to}
            </h2>
          </div>
        </div>
        <StatusBadge status={ride.status} />
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <Info icon={Calendar} label="Departure" value={new Date(ride.time).toLocaleString()} color="blue" />
        <Info icon={Car} label="Vehicle" value={ride.vehicleType} color="violet" />
        <Info icon={IndianRupee} label="Seat Price" value={`₹${ride.seatPrice}`} color="emerald" />
        <Info icon={Ticket} label="Seats Left" value={`${ride.availableSeats}/${ride.seats}`} color="amber" />
      </div>

      {ride.postedBy && (
        <div className="relative mt-5 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white text-blue-600 p-2.5 rounded-xl shrink-0">
              <UserRound size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-blue-600 text-[10px] font-bold tracking-widest uppercase">
                Verified Driver
              </p>
              <p className="font-bold text-slate-900 truncate">{ride.postedBy.name}</p>
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
        </div>
      )}

      <Link
        to={`/ride/${ride._id}`}
        className="relative mt-5 flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-xl hover:shadow-violet-500/30 py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
      >
        View Ride Details
        <ArrowRight size={17} className="group-hover:translate-x-1 transition" />
      </Link>
    </div>
  );
}

function Info({ icon: Icon, label, value, color }) {
  const map = {
    blue: "text-blue-600",
    violet: "text-violet-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <p className="text-slate-500 text-[11px] font-semibold flex gap-1.5 items-center uppercase tracking-wide">
        <Icon size={13} className={map[color]} />
        {label}
      </p>
      <p className="font-bold text-slate-900 mt-1 text-sm truncate">{value}</p>
    </div>
  );
}
