
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Pill, CalendarDays } from "lucide-react";
import api from "../services/api";

function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await api.get("prescriptions/");
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                setPrescriptions(data);
            } catch (err) {
                setError("Unable to load prescriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">

                <Link to="/patient"
                    className="inline-flex items-center gap-2 text-blue-900 mb-6 hover:underline">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">

                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                            <FileText size={26} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                My Prescriptions
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                View prescriptions provided by your doctors.
                            </p>
                        </div>
                    </div>

                    {loading && <p className="text-slate-500">Loading prescriptions...</p>}

                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && !error && prescriptions.length === 0 && (
                        <div className="text-center py-12">
                            <FileText size={45} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-600 font-medium">
                                No prescriptions available.
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                Your prescriptions will appear here after your consultation.
                            </p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {prescriptions.map((item) => (
                            <div key={item.id}
                                className="border border-slate-200 rounded-xl p-6">

                                <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                                    <h2 className="font-semibold text-slate-800 text-lg">
                                        Prescription #{item.id}
                                    </h2>
                                    <span className="text-sm text-slate-500 flex items-center gap-2">
                                        <CalendarDays size={16} />
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                        Diagnosis
                                    </h3>
                                    <p className="text-slate-600">{item.diagnosis}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Pill size={17} /> Medicines
                                    </h3>
                                    <p className="text-slate-600 whitespace-pre-line">
                                        {item.medicines}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                        Doctor's Instructions
                                    </h3>
                                    <p className="text-slate-600 whitespace-pre-line">
                                        {item.instructions || "No additional instructions."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PatientPrescriptions;
