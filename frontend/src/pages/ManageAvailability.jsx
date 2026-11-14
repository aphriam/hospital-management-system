
import { useEffect, useState } from "react";
import { CalendarDays, Clock, Plus, Trash2 } from "lucide-react";
import api from "../services/api";

export default function ManageAvailability() {
    const [availabilities, setAvailabilities] = useState([]);
    const [form, setForm] = useState({
        date: "",
        start_time: "",
        end_time: "",
        slot_duration: 30,
        is_available: true,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchAvailability = async () => {
        try {
            const response = await api.get("doctor-availability/");
            setAvailabilities(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch {
            setError("Unable to load availability.");
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("doctor-availability/", {
                ...form,
                slot_duration: Number(form.slot_duration),
            });

            setSuccess("Availability added successfully.");
            setForm({
                date: "",
                start_time: "",
                end_time: "",
                slot_duration: 30,
                is_available: true,
            });

            await fetchAvailability();
        } catch (err) {
            const data = err.response?.data;
            setError(
                typeof data === "object"
                    ? Object.values(data).flat().join(" ")
                    : "Unable to add availability."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this availability?")) return;

        try {
            await api.delete(`doctor-availability/${id}/`);
            setAvailabilities((previous) =>
                previous.filter((item) => item.id !== id)
            );
        } catch {
            setError("Unable to delete availability.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 py-5">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Manage Availability
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Set your working dates and appointment slots.
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Plus className="text-blue-700" />
                        <h2 className="text-lg font-semibold text-slate-800">
                            Add Availability
                        </h2>
                    </div>

                    {error && (
                        <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">
                            {success}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                required
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start time</label>
                                <input
                                    type="time"
                                    name="start_time"
                                    value={form.start_time}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">End time</label>
                                <input
                                    type="time"
                                    name="end_time"
                                    value={form.end_time}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Slot duration
                            </label>
                            <select
                                name="slot_duration"
                                value={form.slot_duration}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={20}>20 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                name="is_available"
                                checked={form.is_available}
                                onChange={handleChange}
                            />
                            Make this availability visible to patients
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg"
                        >
                            {loading ? "Saving..." : "Add Availability"}
                        </button>
                    </form>
                </section>

                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <CalendarDays className="text-blue-700" />
                        <h2 className="text-lg font-semibold text-slate-800">
                            My Availability
                        </h2>
                    </div>

                    {availabilities.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            No availability added yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {availabilities.map((item) => (
                                <div
                                    key={item.id}
                                    className="border rounded-lg p-4 flex justify-between gap-3"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {item.date}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                            <Clock size={15} />
                                            {item.start_time} – {item.end_time}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {item.slot_duration} minute slots
                                        </p>
                                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                                            item.is_available
                                                ? "bg-green-50 text-green-700"
                                                : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {item.is_available ? "Available" : "Unavailable"}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete availability"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
