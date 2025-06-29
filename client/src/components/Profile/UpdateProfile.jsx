import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAddInfoQuery, useUpdateAddInfoMutation, useUpdateProfileDetailsMutation } from "../../redux/api/apiSlice";

const UpdateProfile = () => {
  const location = useLocation();
  const { alumni } = location.state;
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(alumni.profile_photo);
  const [profileImage, setProfileImage] = useState(null);
  const { data, isLoading, isError } = useGetAddInfoQuery(alumni.id);

  const profilePhotoInputRef = useRef(null);

  const [updateAddInfo] = useUpdateAddInfoMutation();
  const [updateProfileDetails] = useUpdateProfileDetailsMutation();

  const [formData, setFormData] = useState({
    name: alumni.name || "",
    email: alumni.email || "",
    company_name: alumni.company_name || "",
    company_location: alumni.company_location || "",
    address: alumni.address || "",
    graduationYear: alumni.graduationYear || "",
    hobbies: "",
    about: "",
    profile_photo: null,
  });

  useEffect(() => {
    if (data && data.data) {
      setFormData(prevState => ({
        ...prevState,
        hobbies: data.data.hobbies || "",
        about: data.data.about || "",
      }));
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading....</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Update profile photo preview
      setProfileImage(file); // Set the selected image for upload
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append("username", alumni.username);
    profileData.append("name", formData.name);
    profileData.append("email", formData.email);
    profileData.append("companyName", formData.company_name);
    profileData.append("companyLocation", formData.company_location);
    profileData.append("address", formData.address);
    profileData.append("graduationYear", formData.graduationYear);
    if (profileImage) {
      profileData.append("profile_photo", profileImage); // profile photo added here
    }

    const additionalInfoData = {
      hobbies: formData.hobbies,
      about: formData.about,
    };

    try {
      await updateProfileDetails(profileData).unwrap();
      await updateAddInfo({ alumni_id: alumni.id, hobbies: additionalInfoData.hobbies, about: additionalInfoData.about }).unwrap();
      navigate("/alumniDashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-whiteyy p-6 mt-[63px]">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#045774] p-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-[#045774] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white mt-4">Update Profile</h1>
        </div>

        {/* Profile Photo Section */}
        <div className="p-6 text-center">
          <label htmlFor="profilePhotoInput" className="cursor-pointer">
            <div className="relative w-36 h-36 mx-auto">
              <img
                src={profilePhoto || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-[#045774] p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <span className="text-[#045774] font-semibold mt-2 block">Change Profile Photo</span>
          </label>
          <input
            id="profilePhotoInput"
            type="file"
            name="profile_photo"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Company Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Location</label>
              <input
                type="text"
                name="company_location"
                value={formData.company_location}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profession</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Hobbies */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Hobbies</label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
                rows="3"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-[#045774] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#03455e] transition duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;