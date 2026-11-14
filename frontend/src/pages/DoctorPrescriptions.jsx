
import { useEffect, useState } from "react";
import { ClipboardList, Plus, FileText } from "lucide-react";
import api from "../services/api";

export default function DoctorPrescriptions() {
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        appointment: "",
        diagnosis: "",
        medicines: "",
        instructions: "",
    });

    const fetchData = async () => {
        try {
            const [appointmentResponse, prescriptionResponse] =
                await Promise.all([
                    api.get("appointments/"),
                    api.get("prescriptions/"),
                ]);

            const appointmentData = Array.isArray(appointmentResponse.data)
                ? appointmentResponse.data
                : appointmentResponse.data.results || [];

            const prescriptionData = Array.isArray(prescriptionResponse.data)
                ? prescriptionResponse.data
                : prescriptionResponse.data.results || [];

            setAppointments(
                appointmentData.filter((item) => item.status === "COMPLETED")
            );
            setPrescriptions(prescriptionData);
        } catch {
            setError("Unable to load prescription information.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("prescriptions/", {
                ...form,
                appointment: Number(form.appointment),
            });

            setSuccess("Prescription created successfully.");
            setForm({
                appointment: "",
                diagnosis: "",
                medicines: "",
                instructions: "",
            });
            setShowForm(false);
            await fetchData();
        } catch (err) {
            const data = err.response?.data;
            setError(
                typeof data === "object"
                    ? Object.values(data).flat().join(" ")
                    : "Unable to create prescription."
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 py-5">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Prescriptions
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Create and manage patient prescriptions.
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-800">
                        My Prescriptions
                    </h2>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={17} />
                        Create Prescription
                    </button>
                </div>

                {error && (
                    <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
                        {success}
                    </p>
                )}

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white border rounded-xl p-6 mb-8 space-y-4"
                    >
                        <h3 className="font-semibold text-slate-800">
                            New Prescription
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Completed Appointment
                            </label>
                            <select
                                name="appointment"
                                value={form.appointment}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="">Select appointment</option>
                                {appointments.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        Appointment #{item.id} - {item.date} - Patient #{item.patient}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Diagnosis
                            </label>
                            <textarea
                                name="diagnosis"
                                value={form.diagnosis}
                                onChange={handleChange}
                                required
                                rows="2"
                                className="w-full border rounded-lg p-3"
                                placeholder="Enter diagnosis"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Medicines
                            </label>
                            <textarea
                                name="medicines"
                                value={form.medicines}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full border rounded-lg p-3"
                                placeholder="Enter prescribed medicines and dosage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Instructions
                            </label>
                            <textarea
                                name="instructions"
                                value={form.instructions}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border rounded-lg p-3"
                                placeholder="Enter patient instructions"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
                        >
                            Save Prescription
                        </button>
                    </form>
                )}

                {loading ? (
                    <p className="text-slate-500">Loading prescriptions...</p>
                ) : prescriptions.length === 0 ? (
                    <div className="bg-white border rounded-xl p-10 text-center">
                        <ClipboardList
                            className="mx-auto text-slate-400 mb-3"
                            size={36}
                        />
                        <h3 className="font-semibold text-slate-700">
                            No prescriptions yet
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Prescriptions you create will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {prescriptions.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border rounded-xl p-5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="text-blue-700" />
                                    <h3 className="font-semibold text-slate-800">
                                        Prescription #{item.id}
                                    </h3>
                                </div>

                                <p className="text-sm text-slate-500 mb-2">
                                    Appointment #{item.appointment}
                                </p>

                                <p className="text-sm font-medium text-slate-700">
                                    Diagnosis
                                </p>
                                <p className="text-sm text-slate-600 mb-3">
                                    {item.diagnosis}
                                </p>

                                <p className="text-sm font-medium text-slate-700">
                                    Medicines
                                </p>
                                <p className="text-sm text-slate-600 mb-3 whitespace-pre-line">
                                    {item.medicines}
                                </p>

                                <p className="text-sm font-medium text-slate-700">
                                    Instructions
                                </p>
                                <p className="text-sm text-slate-600 whitespace-pre-line">
                                    {item.instructions || "No additional instructions"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
