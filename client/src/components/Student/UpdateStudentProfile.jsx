import React, { useState, useEffect } from "react";
import {
  useGetAddStudentInfoQuery,
  useGetStudentProfileQuery,
  useUpdateAddStudentInfoMutation,
  useUpdateStudentProfileDetailsMutation,
} from "../../redux/api/apiSlice";
import useAuth from "../../redux/hooks/useAuth";

const UpdateStudentProfile = () => {
  const { user, currentUserId } = useAuth();
  const { data: student, isLoading: studentLoader } = useGetStudentProfileQuery(currentUserId);
  const { data: addInfo, isLoading: addInfoLoader } = useGetAddStudentInfoQuery(currentUserId);

  const [updateAddStudentInfo] = useUpdateAddStudentInfoMutation();
  const [updateStudentProfileDetails] = useUpdateStudentProfileDetailsMutation();

  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    admissionYear: "",
    department: "",
    hobbies: "",
    about: "",
    skills: "",
    interestedFields: "",
  });

  // Set initial form data when student and addInfo data is available
  useEffect(() => {
    if (student) {
      setFormData((prev) => ({
        ...prev,
        email: student.data.email || "",
        admissionYear: student.data.admission_year || "",
        department: student.data.department || "",
      }));
      setProfilePhoto(student.data.profile_photo || "");
    }
    if (addInfo) {
      setFormData((prev) => ({
        ...prev,
        hobbies: addInfo.data.hobbies || "",
        about: addInfo.data.about || "",
        skills: addInfo.data.skills || "",
        interestedFields: addInfo.data.interested_fields || "",
      }));
    }
  }, [student, addInfo]);

  if (studentLoader || addInfoLoader) {
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
    console.log(formData.email)
    // Prepare profile data for updateStudentProfileDetails
    const profileData = new FormData();
    profileData.append("id", currentUserId);
    profileData.append("email", formData.email);
    profileData.append("admission_year", formData.admissionYear);
    profileData.append("department", formData.department);
    if (profileImage) {
      profileData.append("profile_photo", profileImage);
    }

    // Prepare additional info data for updateAddStudentInfo
    const additionalInfoData = {
      hobbies: formData.hobbies,
      about: formData.about,
      skills: formData.skills,
      interested_fields: formData.interestedFields,
    };

    try {
        for (let pair of profileData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }
          
      // Update profile details
      await updateStudentProfileDetails(profileData).unwrap();

      // Update additional info
      await updateAddStudentInfo({ id: currentUserId, data: additionalInfoData }).unwrap();

      console.log("Profile updated successfully!");
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (studentLoader || addInfoLoader) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#045774] to-[#033146] p-6 mt-[63px]">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#045774] p-6">
          <h1 className="text-3xl font-bold text-white">Update Student Profile</h1>
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

            {/* Admission Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Admission Year</label>
              <input
                type="number"
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
                rows="3"
              />
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#045774] focus:border-[#045774]"
                rows="3"
              />
            </div>

            {/* Interested Fields */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Interested Fields</label>
              <textarea
                name="interestedFields"
                value={formData.interestedFields}
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

export default UpdateStudentProfile;