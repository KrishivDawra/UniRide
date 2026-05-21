import React, { useEffect, useState } from "react";
import { Calendar, Car, IndianRupee, MapPin, Ticket, UserRound, XCircle, Loader2 } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/user");
      setBookings(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 mt-1.5">Track all your ride reservations in one place.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Ticket size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No bookings yet</h2>
            <p className="text-slate-500 mt-2">Book a ride and it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600 shrink-0" />
                      <span className="truncate">{booking.ride?.from} → {booking.ride?.to}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      ID: {booking._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <InfoTile icon={Calendar} label="Time" value={new Date(booking.ride?.time).toLocaleString()} color="blue" />
                  <InfoTile icon={Ticket} label="Seats" value={booking.seats.join(", ")} color="violet" />
                  <InfoTile icon={IndianRupee} label="Amount" value={`₹${booking.amount}`} color="emerald" />
                  <InfoTile icon={Car} label="Payment" value={booking.paymentStatus} color="blue" />
                </div>

                {booking.driver && (
                  <div className="mt-5 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-3.5">
                    <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0">
                      <UserRound size={18} />
                    </div>
                    <p className="text-sm text-slate-700">
                      Driver: <span className="font-semibold text-slate-900">{booking.driver.name}</span>
                      {booking.driver.mobile && <span className="text-slate-500"> · {booking.driver.mobile}</span>}
                    </p>
                  </div>
                )}

                {booking.status === "booked" && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="mt-5 w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-2xl font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition flex justify-center items-center gap-2"
                  >
                    <XCircle size={18} />
                    Cancel Booking
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

function InfoTile({ icon: Icon, label, value, color }) {
  const map = {
    blue: "text-blue-600",
    violet: "text-violet-600",
    emerald: "text-emerald-600",
  };
  return (
    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
      <p className="text-slate-500 flex items-center gap-2 text-xs font-medium">
        <Icon size={14} className={map[color]} /> {label}
      </p>
      <p className="font-semibold text-slate-900 mt-1 truncate">{value}</p>
    </div>
  );
}
