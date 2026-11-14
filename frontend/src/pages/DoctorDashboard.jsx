
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    ClipboardList,
    UserRound,
    LogOut,
    Stethoscope,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function DoctorDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const cards = [
        {
            title: "My Appointments",
            description: "View and manage patient appointments.",
            icon: CalendarDays,
            path: "/doctor/appointments",
        },
        {
            title: "Manage Availability",
            description: "Set your working dates and time slots.",
            icon: Clock,
            path: "/doctor/availability",
        },
        {
            title: "Prescriptions",
            description: "Create and view patient prescriptions.",
            icon: ClipboardList,
            path: "/doctor/prescriptions",
        },
        {
            title: "My Profile",
            description: "View your professional details.",
            icon: UserRound,
            path: "/doctor/profile",
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-700 p-2 rounded-lg">
                            <Stethoscope className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                MediCare Hospital
                            </h1>
                            <p className="text-sm text-slate-500">
                                Doctor Portal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-600 hover:text-red-600"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <p className="text-sm text-slate-500">
                        Doctor Dashboard
                    </p>
                    <h2 className="text-3xl font-bold text-slate-800 mt-1">
                        Welcome, Dr. {user?.username || "Doctor"}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Manage your schedule, appointments and prescriptions.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <button
                                key={card.title}
                                onClick={() => navigate(card.path)}
                                className="text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
                                    <Icon className="text-blue-700" size={24} />
                                </div>

                                <h3 className="font-semibold text-lg text-slate-800">
                                    {card.title}
                                </h3>

                                <p className="text-sm text-slate-500 mt-2">
                                    {card.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
