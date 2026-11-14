
import { useEffect, useState } from "react";
import { CalendarDays, Clock, XCircle, RefreshCw } from "lucide-react";
import api from "../services/api";

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("appointments/");
            const data = response.data;

            setAppointments(
                Array.isArray(data) ? data : data.results || []
            );
        } catch (err) {
            console.error("Appointments error:", err);
            setError("Unable to load appointments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const cancelAppointment = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            await api.post(`appointments/${id}/cancel/`);
            fetchAppointments();
        } catch (err) {
            console.error(err);
            alert("Unable to cancel appointment.");
        }
    };

    const statusStyle = (status) => {
        const styles = {
            PENDING: "bg-amber-50 text-amber-700",
            APPROVED: "bg-green-50 text-green-700",
            REJECTED: "bg-red-50 text-red-700",
            COMPLETED: "bg-blue-50 text-blue-700",
            CANCELLED: "bg-gray-100 text-gray-600",
        };

        return styles[status] || "bg-gray-100 text-gray-600";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            My Appointments
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            View and manage your appointment requests.
                        </p>
                    </div>

                    <button
                        onClick={fetchAppointments}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-100"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        Loading appointments...
                    </div>
                ) : error ? (
                    <div className="rounded-xl bg-white p-10 text-center text-red-600 shadow-sm">
                        {error}
                        <button
                            onClick={fetchAppointments}
                            className="ml-3 underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <CalendarDays className="mx-auto mb-4 text-gray-400" size={42} />
                        <h2 className="text-xl font-semibold text-slate-800">
                            No appointments yet
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Your appointment requests will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-col justify-between gap-4 md:flex-row">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-800">
                                            Appointment #{appointment.id}
                                        </h2>

                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <CalendarDays size={16} />
                                                {appointment.date}
                                            </span>

                                            <span className="flex items-center gap-2">
                                                <Clock size={16} />
                                                {appointment.start_time} - {appointment.end_time}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-sm text-gray-600">
                                            <strong>Reason:</strong>{" "}
                                            {appointment.reason}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start gap-3 md:items-end">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(appointment.status)}`}>
                                            {appointment.status}
                                        </span>

                                        {(appointment.status === "PENDING" ||
                                            appointment.status === "APPROVED") && (
                                            <button
                                                onClick={() => cancelAppointment(appointment.id)}
                                                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <XCircle size={16} />
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
