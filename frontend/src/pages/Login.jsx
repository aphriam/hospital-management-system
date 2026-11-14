import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";import { AuthContext } from "../context/AuthContext";
import { Stethoscope, Lock, User } from "lucide-react";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const user = await login(username, password);

            if (user.role === "ADMIN") navigate("/admin");
            else if (user.role === "DOCTOR") navigate("/doctor");
            else if (user.role === "PATIENT") navigate("/patient");

        } catch (error) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-900 text-white p-3 rounded-full mb-3">
                        <Stethoscope size={32} />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Hospital Management
                    </h1>

                    <p className="text-slate-500 text-sm mt-2">
                        Sign in to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Username
                        </label>

                        <div className="flex items-center border border-slate-300 rounded-lg px-3">
                            <User size={18} className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 outline-none text-slate-700"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>

                        <div className="flex items-center border border-slate-300 rounded-lg px-3">
                            <Lock size={18} className="text-slate-400" />

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 outline-none text-slate-700"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                        Sign In
                    </button>

                </form>
                <p className="text-center text-sm text-slate-500 mt-6">
    Don't have an account?{" "}
    <Link
        to="/register"
        className="text-blue-900 font-semibold hover:underline"
    >
        Register here
    </Link>
</p>

                <p className="text-center text-xs text-slate-400 mt-8">
                    © 2026 Hospital Management System
                </p>

            </div>
        </div>
    );
}

export default Login;