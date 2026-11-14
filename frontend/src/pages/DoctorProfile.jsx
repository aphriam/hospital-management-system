
import { useContext, useEffect, useState } from "react";
import { UserRound, Stethoscope, GraduationCap, Briefcase, Phone, Mail } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function DoctorProfile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("doctors/");
                const doctors = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                const currentDoctor = doctors.find(
                    (doctor) => doctor.user?.id === user?.id
                );

                if (!currentDoctor) {
                    setError("Doctor profile not found.");
                } else {
                    setProfile(currentDoctor);
                }
            } catch {
                setError("Unable to load doctor profile.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchProfile();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-slate-500">Loading profile...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 py-5">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800">
                        My Profile
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Your professional information.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <div className="bg-white border rounded-xl overflow-hidden">
                    <div className="bg-blue-900 p-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/15 p-4 rounded-full">
                                <UserRound size={36} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Dr. {profile.user?.username}
                                </h2>
                                <p className="text-blue-100 mt-1">
                                    {profile.specialization}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div className="flex gap-3">
                            <Mail className="text-blue-700" />
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="font-medium text-slate-800">
                                    {profile.user?.email || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Phone className="text-blue-700" />
                            <div>
                                <p className="text-sm text-slate-500">Phone</p>
                                <p className="font-medium text-slate-800">
                                    {profile.phone || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <GraduationCap className="text-blue-700" />
                            <div>
                                <p className="text-sm text-slate-500">Qualification</p>
                                <p className="font-medium text-slate-800">
                                    {profile.qualification || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Briefcase className="text-blue-700" />
                            <div>
                                <p className="text-sm text-slate-500">Experience</p>
                                <p className="font-medium text-slate-800">
                                    {profile.experience} years
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Stethoscope className="text-blue-700" />
                            <div>
                                <p className="text-sm text-slate-500">Specialization</p>
                                <p className="font-medium text-slate-800">
                                    {profile.specialization}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t px-8 py-4 text-sm text-slate-500">
                        Doctor ID: {profile.id}
                    </div>
                </div>
            </main>
        </div>
    );
}
