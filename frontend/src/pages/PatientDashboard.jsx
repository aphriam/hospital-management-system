import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    ClipboardList,
    FileText,
    UserRound,
    LogOut,
    HeartPulse,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function PatientDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-900 text-white p-2 rounded-lg">
                        <HeartPulse size={24} />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            MediCare Hospital
                        </h1>
                        <p className="text-xs text-slate-500">
                            Patient Portal
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
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-8">

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Welcome, {user?.username || "Patient"}
                    </h2>

                    <p className="text-slate-500 mt-1">
                        Manage your appointments and medical information.
                    </p>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DashboardCard
                        title="Book Appointment"
                        description="Find doctors and request appointments."
                        icon={<CalendarDays size={26} />}
                        onClick={() => navigate("/patient/book-appointment")}
                    />

                    <DashboardCard
                        title="My Appointments"
                        description="View your appointment requests and history."
                        icon={<ClipboardList size={26} />}
                        onClick={() => navigate("/patient/appointments")}
                    />

                    <DashboardCard
                        title="Prescriptions"
                        description="View your prescriptions and medicines."
                        icon={<FileText size={26} />}
                        onClick={() => navigate("/patient/prescriptions")}
                    />

                    <DashboardCard
                        title="My Profile"
                        description="View and update your personal information."
                        icon={<UserRound size={26} />}
                        onClick={() => navigate("/patient/profile")}
                    />
                </div>
            </main>
        </div>
    );
}

function DashboardCard({ title, description, icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
        >
            <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {icon}
            </div>

            <h3 className="font-semibold text-slate-800 text-lg">
                {title}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
                {description}
            </p>
        </button>
    );
}

export default PatientDashboard;
