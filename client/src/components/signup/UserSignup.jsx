import React, { useState } from "react";
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";


const UserSignup = ({ goBack }) => {
  const navigate = useNavigate();
  const { UpdateUserLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("@gmail.com");
  const [department, setDepartment] = useState("CSE");
  const [admissionYear, setAdmissionYear] = useState("2000");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Create a preview URL
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("department", department);
      formData.append("admissionYear", admissionYear);
      formData.append("role", "user");
      formData.append("profilePhoto", profileImage);

      const response = await fetch('http://localhost:3000/api/user/signup', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setSuccessMessage(data.message);
        setError("");
        UpdateUserLogin(data.username, data.role, data.token, data.id);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div >
      {/* Form Container */}
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-start items-center gap-[70px]">

          <button onClick={goBack} className="text-xl mb-4 text-white">
          <IoArrowBack />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Student Signup</h2>
          </div>
          <div className="flex flex-col items-center mb-6">
            {/* Profile Photo */}
            <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden mb-4">
              <img
                src={profilePhoto || "/profile.png"} // Default placeholder image
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="block font-semibold text-center mb-2 text-white">
              Upload Profile Photo
            </label>
            <input
              type="file"
              className="hidden"
              id="profilePhotoInput"
              onChange={handlePhotoChange}
              accept="image/*"
            />
            <button
              onClick={() => document.getElementById("profilePhotoInput").click()}
              className="px-4 py-2 bg-[#045774] text-white rounded-lg hover:bg-[#C0C596] hover:text-[#045774]"
            >
              Choose Photo
            </button>
          </div>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label className="block mb-2 font-semibold text-white">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-white">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-white">College Email ID</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-white">Department</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-white">Admission Year</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="w-full bg-[#045774] text-white py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774]"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
