import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    Clock,
    RefreshCw,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("appointments/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setAppointments(data);
        } catch (err) {
            setError("Unable to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateAppointment = async (id, action) => {
        try {
            setProcessingId(id);
            setError("");
            await api.post(`appointments/${id}/${action}/`);
            await fetchAppointments();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                `Unable to ${action} this appointment.`
            );
        } finally {
            setProcessingId(null);
        }
    };

    const statusStyle = {
        PENDING: "bg-amber-50 text-amber-700",
        APPROVED: "bg-green-50 text-green-700",
        REJECTED: "bg-red-50 text-red-700",
        COMPLETED: "bg-blue-50 text-blue-700",
        CANCELLED: "bg-slate-100 text-slate-600",
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 text-blue-900 hover:underline mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Manage Appointments
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Approve or reject patient requests based on current doctor availability.
                            </p>
                        </div>

                        <button
                            onClick={fetchAppointments}
                            className="inline-flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <p className="text-slate-500">Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <p className="text-slate-500">No appointments found.</p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="border border-slate-200 rounded-xl p-5"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                                        <div className="space-y-2">
                                            <p className="font-semibold text-slate-800">
                                                {appointment.patient_username ||
                                                    `Patient #${appointment.patient}`}
                                                {" "}with Dr.{" "}
                                                {appointment.doctor_name ||
                                                    `#${appointment.doctor}`}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                <span className="inline-flex items-center gap-2">
                                                    <CalendarDays size={15} />
                                                    {appointment.date}
                                                </span>
                                                <span className="inline-flex items-center gap-2">
                                                    <Clock size={15} />
                                                    {appointment.start_time} - {appointment.end_time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600">
                                                <strong>Reason:</strong> {appointment.reason}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={`text-xs font-semibold px-3 py-2 rounded-full ${
                                                    statusStyle[appointment.status] ||
                                                    "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {appointment.status}
                                            </span>

                                            {appointment.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => updateAppointment(appointment.id, "approve")}
                                                        disabled={processingId === appointment.id}
                                                        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg"
                                                    >
                                                        <Check size={16} />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateAppointment(appointment.id, "reject")}
                                                        disabled={processingId === appointment.id}
                                                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg"
                                                    >
                                                        <X size={16} />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAppointments;
