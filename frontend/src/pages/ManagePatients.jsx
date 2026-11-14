import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ManagePatients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("patient-profile/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setPatients(data);
        } catch (err) {
            setError("Unable to load patients.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((patient) => {
        const query = search.toLowerCase();

        return (
            (patient.username || "").toLowerCase().includes(query) ||
            (patient.email || "").toLowerCase().includes(query) ||
            (patient.phone || "").toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 text-blue-900 hover:underline mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                                <Users size={26} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Manage Patients
                                </h1>
                                <p className="text-sm text-slate-500">
                                    View all registered patients.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={fetchPatients}
                            className="inline-flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    <div className="relative mb-6 max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-3.5 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name, email or phone"
                            className="w-full border border-slate-300 rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

                    {loading && (
                        <p className="text-slate-500">Loading patients...</p>
                    )}

                    {error && (
                        <div className="flex items-center gap-3 text-red-600">
                            <p>{error}</p>
                            <button onClick={fetchPatients} className="underline">
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && filteredPatients.length === 0 && (
                        <p className="text-slate-500">
                            {patients.length === 0
                                ? "No patients registered yet."
                                : "No patients match your search."}
                        </p>
                    )}

                    {!loading && !error && filteredPatients.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                                        <th className="py-3 pr-4">Patient</th>
                                        <th className="py-3 pr-4">Email</th>
                                        <th className="py-3 pr-4">Date of Birth</th>
                                        <th className="py-3 pr-4">Gender</th>
                                        <th className="py-3 pr-4">Phone</th>
                                        <th className="py-3">Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map((patient) => (
                                        <tr
                                            key={patient.id}
                                            className="border-b border-slate-100 last:border-0"
                                        >
                                            <td className="py-4 pr-4 font-medium text-slate-800">
                                                {patient.username || "—"}
                                            </td>
                                            <td className="py-4 pr-4 text-slate-600">
                                                {patient.email || "—"}
                                            </td>
                                            <td className="py-4 pr-4 text-slate-600">
                                                {patient.date_of_birth || "—"}
                                            </td>
                                            <td className="py-4 pr-4 text-slate-600">
                                                {patient.gender || "—"}
                                            </td>
                                            <td className="py-4 pr-4 text-slate-600">
                                                {patient.phone || "—"}
                                            </td>
                                            <td className="py-4 text-slate-600">
                                                {patient.address || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManagePatients;
