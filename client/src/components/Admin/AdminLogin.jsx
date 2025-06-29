import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../redux/hooks/useAuth';

const AdminLogin = () => {
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("Admin@123");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { UpdateUserLogin } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password, role: "admin" }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed.");
            }

            const data = await response.json();
            UpdateUserLogin(data.username, data.role, data.token);
            navigate("/adminDashboard");
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div
            className="flex justify-center items-center h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/obbu.jpg')" }}
        >
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-6 mt-16">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <label className="block mb-2 font-semibold text-white">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg mb-4 bg-white bg-opacity-20 text-white placeholder-gray-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="block mb-2 font-semibold text-white">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg mb-4 bg-white bg-opacity-20 text-white placeholder-gray-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        ripple={true}
                        className="w-full bg-[#045774] text-white py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774]"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
