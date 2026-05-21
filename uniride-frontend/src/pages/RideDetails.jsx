import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Car, IndianRupee, MapPin, ShieldCheck, Ticket, UserRound } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRide = async () => {
    try {
      const res = await api.get(`/rides/${id}`);
      setRide(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to load ride");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRide();
  }, [id]);

  const toggleSeat = (seatId, available) => {
    if (!available || ride.status !== "open") return;

    setSelected((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const totalAmount = selected.reduce((total, seatId) => {
    const seat = ride?.seatBreakdown?.find((s) => s.seatId === seatId);
    return total + (seat?.price || 0);
  }, 0);

  const handleBooking = async () => {
    if (selected.length === 0) return alert("Select at least one seat");

    try {
      await api.post("/bookings", {
        rideId: ride._id,
        seats: selected,
      });

      alert("Booking successful");
      navigate("/student/bookings");
    } catch (err) {
      alert(err.response?.data?.msg || "Booking failed");
      fetchRide();
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading ride details...</p>;
  if (!ride) return <p className="p-6">Ride not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-3xl p-7 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-2">Ride Details</p>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  {ride.from} → {ride.to}
                </h1>
              </div>

              <StatusBadge status={ride.status} />
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Info icon={Calendar} label="Departure Time" value={new Date(ride.time).toLocaleString()} />
              <Info icon={Car} label="Vehicle" value={ride.vehicleType} />
              <Info icon={Ticket} label="Available Seats" value={`${ride.availableSeats}/${ride.seats}`} />
              <Info icon={IndianRupee} label="Seat Price" value={`₹${ride.seatPrice}`} />
            </div>

            {ride.postedBy && (
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-3xl p-5 flex items-center gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-2xl">
                  <UserRound />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-semibold">Verified Driver</p>
                  <p className="font-bold text-gray-900">{ride.postedBy.name}</p>
                  <p className="text-sm text-gray-600">{ride.postedBy.mobile || ride.postedBy.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-3xl p-7 shadow-sm">
            <h2 className="text-2xl font-bold mb-1">Choose Your Seats</h2>
            <p className="text-gray-500 mb-6">Green seats are available. Blue seats are selected.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ride.seatBreakdown?.map((seat) => {
                const isSelected = selected.includes(seat.seatId);

                return (
                  <button
                    key={seat.seatId}
                    disabled={!seat.available || ride.status !== "open"}
                    onClick={() => toggleSeat(seat.seatId, seat.available)}
                    className={`rounded-2xl p-4 border font-bold transition
                      ${!seat.available ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-50 text-green-700 hover:bg-green-100"}
                      ${isSelected ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : ""}
                    `}
                  >
                    <Ticket className="mx-auto mb-2" size={22} />
                    <p>{seat.seatId}</p>
                    <p className="text-sm">₹{seat.price}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-7 shadow-sm h-fit sticky top-24">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-green-100 text-green-700 p-3 rounded-2xl">
              <ShieldCheck />
            </div>
            <div>
              <h2 className="text-xl font-bold">Booking Summary</h2>
              <p className="text-sm text-gray-500">Confirm before booking</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <Summary label="Selected Seats" value={selected.length ? selected.join(", ") : "None"} />
            <Summary label="Total Seats" value={selected.length} />
            <Summary label="Total Amount" value={`₹${totalAmount}`} />
          </div>

          <button
            onClick={handleBooking}
            disabled={selected.length === 0 || ride.status !== "open"}
            className="mt-6 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Book Selected Seats
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your seat will be reserved instantly after booking.
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-gray-500 text-sm flex items-center gap-2">
        <Icon size={17} />
        {label}
      </p>
      <p className="font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}