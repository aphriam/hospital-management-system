
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    HeartPulse,
    Users,
    Stethoscope,
    CalendarDays,
    ClipboardList,
    LogOut,
    UserPlus,
    FileText,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const cards = [
        {
            title: "Manage Doctors",
            description: "Add and manage doctor accounts.",
            icon: <Stethoscope size={26} />,
            path: "/admin/doctors",
        },
        {
            title: "Manage Patients",
            description: "View registered patients.",
            icon: <Users size={26} />,
            path: "/admin/patients",
        },
        {
            title: "Appointments",
            description: "Review and approve appointment requests.",
            icon: <CalendarDays size={26} />,
            path: "/admin/appointments",
        },
        {
            title: "Prescriptions",
            description: "View hospital prescriptions.",
            icon: <FileText size={26} />,
            path: "/admin/prescriptions",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100">

            <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-900 text-white p-2 rounded-lg">
                        <HeartPulse size={25} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            MediCare Hospital
                        </h1>
                        <p className="text-xs text-slate-500">Administration Portal</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-600"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8">

                <div className="mb-8">
                    <p className="text-sm text-blue-900 font-medium">
                        ADMINISTRATION
                    </p>
                    <h2 className="text-2xl font-bold text-slate-800 mt-2">
                        Welcome, {user?.username || "Admin"}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Manage hospital operations from one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <Link
                            to={card.path}
                            key={card.title}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
                        >
                            <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                {card.icon}
                            </div>

                            <h3 className="font-semibold text-slate-800 text-lg">
                                {card.title}
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                {card.description}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <UserPlus className="text-blue-900" size={24} />
                        <div>
                            <h3 className="font-semibold text-slate-800">
                                Hospital Administration
                            </h3>
                            <p className="text-sm text-slate-500">
                                Manage doctors, patients and appointment approvals.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default AdminDashboard;
