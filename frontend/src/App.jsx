import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import AdminDashboard from "./pages/AdminDashboard";
import ManageDoctors from "./pages/ManageDoctors";
import DoctorDashboard from "./pages/DoctorDashboard";
import ManageAvailability from "./pages/ManageAvailability";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorProfile from "./pages/DoctorProfile";
import PatientAppointments from "./pages/PatientAppointments";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import PatientProfile from "./pages/PatientProfile";
import ManagePatients from "./pages/ManagePatients";
import AdminAppointments from "./pages/AdminAppointments";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Hospital Management System</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/patient/book-appointment" element={<BookAppointment />} />
      <Route path="/admin/doctors" element={<ManageDoctors />} />
      <Route path="/admin/patients" element={<ManagePatients />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/doctor/availability" element={<ManageAvailability />} />
      <Route path="/patient/appointments" element={<PatientAppointments />} />
      <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
      <Route path="/patient/profile" element={<PatientProfile />} />
    </Routes>
  );
}

export default App;