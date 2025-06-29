import React, { useState } from 'react';

const GetDetails = () => {
  const [filters, setFilters] = useState({
    company_name: '',
    graduation_year: '',
    company_location: '',
    address: '',
  });
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      
      const response = await fetch(`http://localhost:3000/api/admin/filter?${query}`);
      const data = await response.json();
      console.log(data)
      setResults(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold text-[#045774] mb-6">Get Details</h2>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="company_name"
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045774] focus:border-transparent"
        />
        <input
          name="graduation_year"
          onChange={handleChange}
          placeholder="Graduation Year"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045774] focus:border-transparent"
        />
        <input
          name="company_location"
          onChange={handleChange}
          placeholder="Company Location"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045774] focus:border-transparent"
        />
        <input
          name="address"
          onChange={handleChange}
          placeholder="Profession"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045774] focus:border-transparent"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[#045774] text-white px-6 py-3 rounded-lg hover:bg-[#C0C596] hover:text-[#045774] transition-colors duration-300"
      >
        Search
      </button>

      {/* Results Display */}
      <div className="mt-6">
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-[#045774] text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Company Name</th>
                  <th className="p-3 text-left">Graduation Year</th>
                  <th className="p-3 text-left">Company Location</th>
                  <th className="p-3 text-left">Profession</th>
                  
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.company_name}</td>
                    <td className="p-3">{item.graduationYear}</td>
                    <td className="p-3">{item.company_location}</td>
                    <td className="p-3">{item.address}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No results found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
};

export default GetDetails;