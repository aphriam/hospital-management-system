
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserRound, Save } from "lucide-react";
import api from "../services/api";

function PatientProfile() {
    const [profile, setProfile] = useState({
        date_of_birth: "",
        gender: "",
        phone: "",
        address: "",
    });

    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("patient-profile/");
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                if (data.length > 0) {
                    setProfileId(data[0].id);
                    setProfile({
                        date_of_birth: data[0].date_of_birth || "",
                        gender: data[0].gender || "",
                        phone: data[0].phone || "",
                        address: data[0].address || "",
                    });
                }
            } catch (err) {
                setError("Unable to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            if (profileId) {
                await api.put(`patient-profile/${profileId}/`, profile);
            } else {
                const response = await api.post("patient-profile/", profile);
                setProfileId(response.data.id);
            }

            setSuccess("Profile saved successfully.");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to save profile. Please check your details."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-3xl mx-auto">

                <Link to="/patient"
                    className="inline-flex items-center gap-2 text-blue-900 mb-6 hover:underline">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">

                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                            <UserRound size={26} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                My Profile
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Manage your personal information.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={profile.date_of_birth}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={profile.address}
                                onChange={handleChange}                                rows="4"
                                placeholder="Enter your address"
                                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

                        {success && (
                            <p className="text-green-700 text-sm">{success}</p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Save Profile"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default PatientProfile;
