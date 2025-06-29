/* 
This Navbar is for rendering User when not logged in
 */

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../redux/hooks/useAuth';

const Navbar = () => {
    const { user, UpdateUserLogout } = useAuth();
    
    const handleClick = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/me/logout", {
                method: "POST",
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log(result.message);
            UpdateUserLogout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-transparent p-4 text-white shadow-lg z-50">
            <div className="relative z-10 mx-auto flex justify-between items-center  ">
                <Link to="/">
                    <div className="text-white flex font-bold text-xl bg-[#045774] p-2 px-4 rounded-xl hover:bg-[#C0C596] hover:text-[#045774]">
                        <span >Rvce</span>
                        <span>Connect</span>
                    </div>
                </Link>

                <div className="flex space-x-4">
                    {user ? (
                        <div className='flex items-center space-x-4'>
                            <span className="text-white font-semibold py-2 px-4 rounded-md">Hi 👋 {user}</span>
                            <button onClick={handleClick} className="bg-[#045774] text-white hover:bg-[#C0C596] hover:text-[#045774] font-semibold px-5 py-2 rounded-lg shadow-md transition-all">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className='flex space-x-4'>
                            <Link to="/login/user" className="bg-[#045774] text-white hover:bg-[#C0C596] hover:text-[#045774] font-semibold px-5 py-2 rounded-lg shadow-md transition-all">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-[#045774] text-white hover:bg-[#C0C596] hover:text-[#045774] font-semibold px-5 py-2 rounded-lg shadow-md transition-all">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
