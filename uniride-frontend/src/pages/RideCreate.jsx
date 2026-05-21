import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Car, IndianRupee, MapPin, Navigation, Users } from "lucide-react";
import api from "../api/axios";

export default function RideCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    time: "",
    vehicleType: "car",
    seats: 4,
    seatPrice: 50,
    pickupLng: 0,
    pickupLat: 0,
    dropLng: 0,
    dropLat: 0,
  });

  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.from || !form.to || !form.time) {
      return alert("Please fill pickup, drop and time");
    }

    try {
      setLoading(true);

      await api.post("/rides", {
        from: form.from,
        to: form.to,
        time: form.time,
        vehicleType: form.vehicleType,
        seats: Number(form.seats),
        seatPrice: Number(form.seatPrice),
        pickupGeo: {
          type: "Point",
          coordinates: [Number(form.pickupLng), Number(form.pickupLat)],
        },
        dropGeo: {
          type: "Point",
          coordinates: [Number(form.dropLng), Number(form.dropLat)],
        },
      });

      alert("Ride created successfully");
      navigate("/driver/my-rides");
    } catch (err) {
      alert(err.response?.data?.msg || "Ride creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-blue-700 text-white rounded-3xl p-8 shadow-xl">
          <div className="bg-white/20 w-fit p-4 rounded-2xl mb-6">
            <Car size={34} />
          </div>

          <h1 className="text-3xl font-extrabold">Create a Ride</h1>
          <p className="mt-3 text-blue-100">
            Publish a ride with seats, pricing, pickup and drop details for students.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <Feature icon={Users} text="Auto seat generation" />
            <Feature icon={IndianRupee} text="Seat-wise pricing" />
            <Feature icon={Navigation} text="Geo-location ready" />
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-2 bg-white border rounded-3xl p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ride Details</h2>
            <p className="text-gray-500 text-sm mt-1">Fill all ride information carefully.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input icon={MapPin} name="from" label="Pickup Location" value={form.from} onChange={handle} placeholder="Chitkara University" />
            <Input icon={MapPin} name="to" label="Drop Location" value={form.to} onChange={handle} placeholder="Sector 17 Chandigarh" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handle}
                className="mt-2 w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <Input icon={Users} name="seats" label="Total Seats" type="number" value={form.seats} onChange={handle} />
            <Input icon={IndianRupee} name="seatPrice" label="Seat Price" type="number" value={form.seatPrice} onChange={handle} />
          </div>

          <Input icon={CalendarClock} name="time" label="Ride Time" type="datetime-local" value={form.time} onChange={handle} />

          <div className="border rounded-3xl p-5 bg-gray-50">
            <h3 className="font-bold mb-3">Coordinates</h3>
            <p className="text-sm text-gray-500 mb-4">
              For now, default coordinates are allowed. Later you can connect this with maps.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              <Input name="pickupLng" label="Pickup Lng" type="number" value={form.pickupLng} onChange={handle} />
              <Input name="pickupLat" label="Pickup Lat" type="number" value={form.pickupLat} onChange={handle} />
              <Input name="dropLng" label="Drop Lng" type="number" value={form.dropLng} onChange={handle} />
              <Input name="dropLat" label="Drop Lat" type="number" value={form.dropLat} onChange={handle} />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Creating Ride..." : "Create Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="mt-2 relative">
        {Icon && <Icon size={18} className="absolute left-4 top-3.5 text-gray-400" />}
        <input
          {...props}
          className={`${Icon ? "pl-11" : "pl-4"} w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span>{text}</span>
    </div>
  );
}