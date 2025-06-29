import React, { useState, useRef, useEffect } from "react";
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const AlumniSignup = ({ goBack }) => {
    const [username, setUsername] = useState("Gaju");
    const [password, setPassword] = useState("Gaju@123");
    const [name, setName] = useState("Anil");
    const [email, setEmail] = useState("gaju@gmail.com");
    const [graduationYear, setGraduationYear] = useState("6790");
    const [companyName, setCompanyName] = useState("TikTok");
    const [companyLocation, setCompanyLocation] = useState("China");
    const [address, setAddress] = useState("Web Devloper");
    const [document, setDocument] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [extractedDoc, setExtractedDoc] = useState("")


    useEffect(() => {
        const fetchData = async () =>{
            if(extractedDoc){
                const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("graduationYear", graduationYear);
        formData.append("companyName", companyName);
        formData.append("companyLocation", companyLocation);
        formData.append("address", address);
        formData.append("document", document);
        formData.append("profilePhoto", profileImage);
                // Send USN to backend for verification
                const checkResponse = await fetch("http://localhost:3000/api/alumni/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usn: extractedDoc }),
                });

                const result = await checkResponse.json();
                if (result.exists) {
                    alert(`Welcome ${result.alumni.Name}`);
                    const response = await fetch("http://localhost:3000/api/alumni/signup", {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                    });

                    const data = await response.json();
                    console.log(data);
                    if (response.ok) {
                        setMessage("Signup successful! You can now log in.");
                        setUsername("");
                        setPassword("");
                        setName("");
                        setEmail("");
                        setGraduationYear("");
                        setCompanyName("");
                        setCompanyLocation("");
                        setAddress("");
                        setDocument(null);
                        setProfilePhoto(null);
                        navigate("/alumnidashboard");
                    } else {
                        setMessage(data.message || "Signup failed. Please try again.");
                    }
                }
             else {
                alert("USN not found in DB!");
            }
            }
        }
        fetchData()
    }, [extractedDoc])
    

    // Refs for file inputs
    const profilePhotoInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const { UpdateUserLogin } = useAuth();
    const navigate = useNavigate();

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocument(file);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file)); // Create a preview URL
            setProfileImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!document) {
            setMessage("Please upload a graduation document.");
            return;
        }

        if (!profileImage) {
            setMessage("Please upload a profile photo.");
            return;
        }

        const docData = new FormData();
        docData.append("image", document);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("graduationYear", graduationYear);
        formData.append("companyName", companyName);
        formData.append("companyLocation", companyLocation);
        formData.append("address", address);
        formData.append("document", document);
        formData.append("profilePhoto", profileImage);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: docData,
                headers: { "Accept": "application/json" },
            });
            const data = await response.json();
            console.log(data.extracted_text)

            const correctedText = data.extracted_text.replace(/I/g, "1");

            // Using regex to extract the specific format (1RVNNXXNNN where XX is any two letters and N is any number from 0-9)
            const match = correctedText.match(/\b[1I]RV\d{2}[A-Z]{2}\d{3}\b/);

            if (match) {
                console.log(match[0]);
                setExtractedDoc(match[0]); //USN Retrived yay!!

            //     // Send USN to backend for verification
            //     const checkResponse = await fetch("http://localhost:3000/api/alumni/check", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({ usn: extractedDoc }),
            //     });

            //     const result = await checkResponse.json();
            //     if (result.exists) {
            //         alert(`Welcome ${result.alumni.Name}`);
            //         const response = await fetch("http://localhost:3000/api/alumni/signup", {
            //             method: "POST",
            //             body: formData,
            //             credentials: "include",
            //         });

            //         const data = await response.json();
            //         console.log(data);
            //         if (response.ok) {
            //             setMessage("Signup successful! You can now log in.");
            //             setUsername("");
            //             setPassword("");
            //             setName("");
            //             setEmail("");
            //             setGraduationYear("");
            //             setCompanyName("");
            //             setCompanyLocation("");
            //             setAddress("");
            //             setDocument(null);
            //             setProfilePhoto(null);
            //             navigate("/alumnidashboard");
            //         } else {
            //             setMessage(data.message || "Signup failed. Please try again.");
            //         }
            //     }
            //  else {
            //     alert("USN not found in DB!");
            // }

        } else {
            console.log("ID not Found in Gradution Copy")
        }

    } catch (err) {
        setMessage("Failed to extract text. Try again.");
    }

    //     try {
    //         const response = await fetch("http://localhost:3000/api/alumni/signup", {
    //             method: "POST",
    //             body: formData,
    //             credentials: "include",
    //         });

    //         const data = await response.json();
    //         console.log(data);
    //         if (response.ok) {
    //             setMessage("Signup successful! You can now log in.");
    //             setUsername("");
    //             setPassword("");
    //             setName("");
    //             setEmail("");
    //             setGraduationYear("");
    //             setCompanyName("");
    //             setCompanyLocation("");
    //             setAddress("");
    //             setDocument(null);
    //             setProfilePhoto(null);
    //             navigate("/pending-approval");
    //         } else {
    //             setMessage(data.message || "Signup failed. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error("Error during signup:", error);
    //         setMessage("An error occurred. Please try again later.");
    //     }
};

return (
    <div className="" 
    >
        <div className="flex justify-start items-center gap-[95px]">

        <button onClick={goBack} className="mb-4 text-xl text-white">
        <IoArrowBack />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Alumni Signup</h2>
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
                ref={profilePhotoInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
            />
            <button
                type="button" // Ensure it doesn't trigger form submission
                onClick={() => profilePhotoInputRef.current.click()}
                className="px-4 py-2 bg-[#045774] text-white rounded-lg hover:bg-[#C0C596] hover:text-[#045774]"
            >
                Choose Photo
            </button>
        </div>

        <form onSubmit={handleSubmit}>
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
            <label className="block mb-2 font-semibold text-white">Name</label>
            <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <label className="block mb-2 font-semibold text-white">Email</label>
            <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label className="block mb-2 font-semibold text-white">Graduation Year</label>
            <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                required
            />
            {/* New Fields */}
            <label className="block mb-2 font-semibold text-white">Company Name</label>
            <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
            />
            <label className="block mb-2 font-semibold text-white">Company Location</label>
            <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
            />
            <label className="block mb-2 font-semibold text-white">Profession</label>
            <textarea
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            {/* Graduation Document Upload */}
           
            <label className="block mb-2 font-semibold text-white">Upload Graduation Document</label>
            <div className="flex justify-center">
            <input
                type="file"
                className="file:bg-gradient-to-r file:from-[#045774] file:to-[#169FCD] file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer w-full mb-4"
                ref={documentInputRef}
                onChange={handleDocumentChange}
                required
            />
           </div>
            {message && <p className="text-red-500">{message}</p>}
            <button
                className="w-full bg-[#045774] text-white py-2 rounded-lg mb-4 hover:bg-[#C0C596] hover:text-[#045774]"
                type="submit"
            >
                Sign Up
            </button>
        </form>
    </div>
);
};

export default AlumniSignup;
