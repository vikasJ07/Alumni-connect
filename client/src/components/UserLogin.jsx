import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../redux/hooks/useAuth';
import { Button } from "@material-tailwind/react";

const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { UpdateUserLogin } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, role: "user" }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            } else {
                setSuccessMessage(data.message);
                UpdateUserLogin(data.username, data.role, data.token, data.id);
                navigate("/");
            }
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
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Student Login</h2>
                <form onSubmit={handleLogin}>
                    <label className="block mb-2 font-semibold text-white">Username</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg mb-4 bg-white bg-opacity-20 text-white placeholder-gray-300"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <button className="w-full bg-[#045774] text-white py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774]" type="submit">
                        Login
                    </button>
                </form>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                
                <div className=" text-center">
                    <button
                        className="w-full bg-[#045774] text-white py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774] my-2"
                        onClick={() => navigate("/login/alumni")}
                        ripple={true}
                    >
                        Login as Alumni
                    </button>
                    
                    <button
                        className="w-full bg-[#045774] text-white py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774]"
                        onClick={() => navigate("/login/admin")}
                    >
                        Login as Admin
                    </button>
                </div>
                <p className="mt-4 text-center text-white">
                    Forgot password? {" "}
                    <span className="text-blue-300 cursor-pointer" onClick={() => navigate("/forgot-password")}>
                        Click here
                    </span>
                </p>
                {/* <p className="mt-4 text-center text-white">
                    New Member? {" "}
                    <span className="text-blue-300 cursor-pointer" onClick={() => navigate("/signup")}>
                        Sign Up
                    </span>
                </p> */}
            </div>
        </div>
    );
};

export default UserLogin;