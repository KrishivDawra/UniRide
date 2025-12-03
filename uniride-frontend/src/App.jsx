import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import StudentDashboard from "./pages/StudentDashboard.jsx";
import DriverDashboard from "./pages/DriverDashboard.jsx";

import RideCreate from "./pages/RideCreate.jsx";
import RideDetails from "./pages/RideDetails.jsx";

// Admin pages
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import ManageRides from "./pages/Admin/ManageRides.jsx";
import ManageBookings from "./pages/Admin/ManageBookings.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute roles={["driver"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/create-ride"
          element={
            <ProtectedRoute roles={["driver"]}>
              <RideCreate />
            </ProtectedRoute>
          }
        />

        {/* Ride Details accessible to both student & driver */}
        <Route
          path="/ride/:id"
          element={
            <ProtectedRoute roles={["student", "driver"]}>
              <RideDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rides"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageRides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
