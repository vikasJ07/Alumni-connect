import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ results, setShowResults }) => {
  const resultRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultRef.current && !resultRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowResults]);

  return (
    <div 
      ref={resultRef} 
      className="absolute top-full w-[350px] bg-white shadow-lg rounded-lg mt-2 max-h-[600px] overflow-y-auto z-50"
    >
      {results.length > 0 ? (
        results.map((user) => (
          <Link
            to={`/profile?id=${user.id}`}
            key={user.id}
            className="flex items-center p-2 hover:bg-gray-100 transition duration-200"
            onClick={() => setShowResults(false)} // Close search on click
          >
            <img
              src={`${user.profile_photo}`}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <div className="ml-2">
              <p className="text-md font-semibold text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">{user.address || "Unknown Profession"}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="p-2 text-gray-500">No results found</p>
      )}
    </div>
  );
};

export default SearchResult;
