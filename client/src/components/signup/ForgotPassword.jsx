import React, { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Password reset link sent to your email.");
            } else {
                setMessage(data.message || "Failed to send reset link.");
            }
        } catch (err) {
            setMessage("Failed to send reset link.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                <form onSubmit={handleForgotPassword}>
                    <label className="block mb-2 font-semibold">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" type="submit">
                        Send Reset Link
                    </button>
                </form>
                {message && <p className="mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
