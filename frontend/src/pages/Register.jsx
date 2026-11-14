import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { UserPlus, User, Mail, Lock } from "lucide-react";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.password2) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await api.post("register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password2: formData.password2,
            });

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.username?.[0] ||
                error.response?.data?.email?.[0] ||
                error.response?.data?.password?.[0] ||
                "Registration failed. Please check your details."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-900 text-white p-3 rounded-full mb-3">
                        <UserPlus size={30} />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Create Patient Account
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Register to access hospital services
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Username
                        </label>
                        <div className="flex items-center border border-slate-300 rounded-lg px-3">
                            <User size={18} className="text-slate-400" />
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="w-full p-3 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <div className="flex items-center border border-slate-300 rounded-lg px-3">
                            <Mail size={18} className="text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full p-3 outline-none"
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full p-3 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="flex items-center border border-slate-300 rounded-lg px-3">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                type="password"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full p-3 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-900 font-semibold">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;