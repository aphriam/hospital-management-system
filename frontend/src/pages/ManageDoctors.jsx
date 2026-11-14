
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Stethoscope,
    UserPlus,
    Search,
    X,
} from "lucide-react";
import api from "../services/api";

function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        specialization: "",
        qualification: "",
        experience: 0,
        phone: "",
    });

    const fetchDoctors = async () => {
        try {
            const response = await api.get("doctors/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setDoctors(data);
            setError("");
        } catch (err) {
            setError("Unable to load doctors.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await api.post("doctors/", {
                ...formData,
                experience: Number(formData.experience),
            });

            setSuccess("Doctor account created successfully!");

            setFormData({
                username: "",
                email: "",
                password: "",
                specialization: "",
                qualification: "",
                experience: 0,
                phone: "",
            });

            setShowForm(false);
            await fetchDoctors();
        } catch (err) {
            const data = err.response?.data;

            setError(
                data?.username?.[0] ||
                data?.email?.[0] ||
                data?.password?.[0] ||
                data?.detail ||
                "Unable to create doctor. Please check the entered details."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const username = doctor.user?.username || "";
        const specialization = doctor.specialization || "";

        return (
            username.toLowerCase().includes(search.toLowerCase()) ||
            specialization.toLowerCase().includes(search.toLowerCase())
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

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                                <Stethoscope size={26} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Manage Doctors
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Add and manage hospital doctors.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setError("");
                                setSuccess("");
                            }}
                            className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-lg font-medium"
                        >
                            {showForm ? <X size={18} /> : <UserPlus size={18} />}
                            {showForm ? "Close Form" : "Add Doctor"}
                        </button>

                    </div>

                    {error && (
                        <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-sm">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="bg-green-50 text-green-700 p-3 rounded-lg mb-5 text-sm">
                            {success}
                        </p>
                    )}

                    {/* Add Doctor Form */}
                    {showForm && (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-6">
                                Doctor Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <FormField
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                />

                                <FormField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                />

                                <FormField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create password"
                                />

                                <FormField
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />

                                <FormField
                                    label="Specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiology"
                                />

                                <FormField
                                    label="Qualification"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g. MBBS, MD"
                                />

                                <FormField
                                    label="Years of Experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Enter experience"
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-6 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                {submitting ? "Creating..." : "Create Doctor Account"}
                            </button>

                        </form>
                    )}

                    {/* Search */}
                    <div className="relative mb-6 max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-3.5 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search doctors..."
                            className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

                    {/* Doctor List */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            Registered Doctors ({filteredDoctors.length})
                        </h2>

                        {loading && (
                            <p className="text-slate-500">Loading doctors...</p>
                        )}

                        {!loading && filteredDoctors.length === 0 && (
                            <div className="text-center bg-slate-50 rounded-xl p-10">
                                <Stethoscope
                                    size={35}
                                    className="mx-auto text-slate-400 mb-3"
                                />
                                <p className="text-slate-600 font-medium">
                                    No doctors found.
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Add a doctor to get started.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className="border border-slate-200 rounded-xl p-5"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-50 text-blue-900 p-3 rounded-full">
                                            <Stethoscope size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-800">
                                                Dr. {doctor.user?.username || "Doctor"}
                                            </h3>
                                            <p className="text-sm text-blue-900">
                                                {doctor.specialization}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500">
                                        {doctor.qualification}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-2">
                                        {doctor.experience} years experience
                                    </p>

                                    <p className="text-sm text-slate-500 mt-2">
                                        {doctor.phone}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                min={type === "number" ? "0" : undefined}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
            />
        </div>
    );
}

export default ManageDoctors;
