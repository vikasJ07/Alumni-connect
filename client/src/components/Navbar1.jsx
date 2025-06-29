import React, { useState } from 'react';
import { Link } from "react-router-dom";
import useAuth from "../redux/hooks/useAuth";
import { CiLogout, CiSearch } from "react-icons/ci";
import SearchResult from './SeaarchResult';

const Navbar = () => {
  const { user, UpdateUserLogout } = useAuth();
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

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

  const fetchData = (value) => {
    fetch("http://localhost:3000/api/dash/alumni/search")
      .then((response) => response.json())
      .then((json) => {
        if (!json.data || !Array.isArray(json.data)) {
          console.error("Invalid data format:", json);
          return;
        }
        console.log
        const result = json.data.filter((user) => {
          return (
            value &&
            user &&
            user.username &&
            user.username.toLowerCase().includes(value.toLowerCase())
          );
        });
        setResults(result);
        setShowResults(result.length > 0);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    if (value.trim() === "") {
      setShowResults(false);
      setResults([]);
    } else {
      fetchData(value);
    }
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-lg shadow-lg p-4 z-50">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex justify-between items-center w-full px-4">
            <Link to="/">
              <div className="text-white flex text-xl bg-[#045774] p-2 px-4 rounded-xl">
                <span>Rvce</span>
                <span>Connect</span>
              </div>
            </Link>

            <div className="relative flex items-center bg-[#045774] p-2 rounded-md">
              <CiSearch className="text-white text-2xl mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                className="bg-transparent text-white placeholder-white focus:outline-none"
              />
              {showResults && <SearchResult results={results} setShowResults={setShowResults} />}
            </div>
          </div>

          <div className="flex space-x-4">
            {user ? (
              <button
                onClick={handleClick}
                className="flex justify-center items-center bg-[#045774] text-white hover:bg-[#C0C596] hover:text-[#045774] font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
              >
                <CiLogout className="text-xl mr-2" />
                Logout
              </button>
            ) : (
              <div className="flex">
                <Link
                  to="/login/user"
                  className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
