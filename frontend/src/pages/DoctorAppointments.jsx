
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UserRound, CheckCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            const response = await api.get("appointments/");
            setAppointments(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch {
            setError("Unable to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const completeAppointment = async (id) => {
        try {
            await api.post(`appointments/${id}/complete/`);
            await fetchAppointments();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to complete this appointment."
            );
        }
    };

    const statusStyle = {
        PENDING: "bg-yellow-50 text-yellow-700",
        APPROVED: "bg-green-50 text-green-700",
        REJECTED: "bg-red-50 text-red-700",
        COMPLETED: "bg-blue-50 text-blue-700",
        CANCELLED: "bg-slate-100 text-slate-600",
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 py-5">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800">
                        My Appointments
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        View and manage your patient appointments.
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {["PENDING", "APPROVED", "COMPLETED"].map((status) => (
                        <div key={status} className="bg-white border rounded-xl p-5">
                            <p className="text-sm text-slate-500">{status}</p>
                            <p className="text-2xl font-bold text-slate-800 mt-2">
                                {appointments.filter((a) => a.status === status).length}
                            </p>
                        </div>
                    ))}
                </div>

                {error && (
                    <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-slate-500">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                    <div className="bg-white border rounded-xl p-10 text-center">
                        <CalendarDays className="mx-auto text-slate-400 mb-3" size={35} />
                        <h2 className="font-semibold text-slate-700">
                            No appointments yet
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Patient appointments will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border rounded-xl overflow-hidden">
                        <div className="p-5 border-b">
                            <h2 className="font-semibold text-slate-800">
                                Appointment List
                            </h2>
                        </div>

                        <div className="divide-y">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-2">
                                        <p className="font-semibold text-slate-800 flex items-center gap-2">
                                            <UserRound size={17} className="text-blue-700" />
                                            Patient #{appointment.patient}
                                        </p>

                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <CalendarDays size={15} />
                                            {appointment.date}
                                        </p>

                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <Clock size={15} />
                                            {appointment.start_time} – {appointment.end_time}
                                        </p>

                                        <p className="text-sm text-slate-600">
                                            Reason: {appointment.reason}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-medium px-3 py-2 rounded-full ${
                                            statusStyle[appointment.status] ||
                                            "bg-slate-100 text-slate-600"
                                        }`}>
                                            {appointment.status}
                                        </span>

                                        {appointment.status === "APPROVED" && (
                                            <button
                                                onClick={() => completeAppointment(appointment.id)}
                                                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-lg"
                                            >
                                                <CheckCircle size={16} />
                                                Complete
                                            </button>
                                        )}

                                        {(appointment.status === "APPROVED" ||
                                            appointment.status === "COMPLETED") && (
                                            <Link
                                                to="/doctor/prescriptions"
                                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-lg"
                                            >
                                                <FileText size={16} />
                                                Prescription
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
