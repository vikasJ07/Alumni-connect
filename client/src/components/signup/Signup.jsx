import React, { useState } from "react";
import AlumniSignup from "../Alumni/AlumniSignup";
import UserSignup from "./UserSignup";
import Navbar from "../Navbar";

const Signup = () => {
    const [role, setRole] = useState("");
    const [step, setStep] = useState(1); // Step 1 for role selection, Step 2 for form

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const goBack = () => {
        setStep(1);
        setRole("");
    };

    return (
        <div >
            <div
                className="flex justify-center items-center min-h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/obbu.jpg')" }}
            >
                <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-6 mt-16">
                    {step === 1 ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center text-white">Choose Your Role</h2>
                            <button
                                className="w-full bg-[#045774] text-white py-2 rounded-lg mb-4 hover:bg-[#C0C596] hover:text-[#045774]"
                                onClick={() => handleRoleSelection("alumni")}
                            >
                                Alumni
                            </button>
                            <button
                                className="w-full bg-[#045774] text-white py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774]"
                                onClick={() => handleRoleSelection("user")}
                            >
                                User
                            </button>
                        </div>
                    ) : role === "alumni" ? (
                        <AlumniSignup goBack={goBack} />
                    ) : (
                        <UserSignup goBack={goBack} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;
