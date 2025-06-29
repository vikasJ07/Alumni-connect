import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AlumniLogin from "./components/Alumni/AlumniLogin";
import AdminLogin from "./components/Admin/AdminLogin";
import UserLogin from "./components/UserLogin";
import Signup from "./components/signup/Signup";
import ForgotPassword from "./components/signup/ForgotPassword";
import UserHome from "./components/Student/UserHome";
import Navbar from "./components/Navbar";
import Navbar1 from "./components/Navbar1";
import PendingApproval from "./components/pendingApproval";
import ProtectedRoute from './utils/protectedRoutes';
import checkRequestStatus from "./utils/checkRequestStatus";
import AdminAlumniRequests from "./components/Admin/AdminAlumniRequests";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AlumniDashboard from "./components/Alumni/AlumniDashboard"
import Loader from "./components/Loader"
import ViewMyProfile from "./components/Profile/ViewMyProfile";//U can delete the post here
import ViewProfile from "./components/Profile/ViewProfile";// U can just view the post here
import UpdateProfile from "./components/Profile/UpdateProfile";
import Notification from "./components/Pages/Notification";
import Chat from "./components/Chat/Chat"
import AdminAnalytics from "./components/Admin/AdminAnalytics";
import ViewStudentProfile from "./components/Student/ViewStudentProfile";
import UpdateStudentProfile from "./components/Student/UpdateStudentProfile";
import  useAuth  from './redux/hooks/useAuth'

const App = () => {
    const { user, currentUserId, UpdateUserLogin} = useAuth()
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(true)
    const getUser = async () => {
        
        try {
          const response = await fetch("http://localhost:3000/api/me", {
            method: "GET",
            credentials: "include", // Equivalent to `withCredentials: true` in axios
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const userData = await response.json();
          // console.log(userData)
          return userData;
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          throw error; // Re-throw the error for further handling
        }finally {
            setisLoading(false); // Loading is complete
        }
      };      
       
    useEffect(() => {
        // const tkn = JSON.parse(localStorage.getItem('token'));
        const fetchUser = async () => {
            try {
              const tkn = await getUser(); // Await the resolved value of the promise
              // console.log(tkn);
              
              if (tkn) {
                // if(tkn.role == "pending"){
                //   // await checkRequestStatus()
                //   navigate("/pending-approval")
                // }
                
                  UpdateUserLogin(tkn.username, tkn.role, tkn.token, tkn.id);
                
              }
            } catch (error) {
              console.error("Error in fetching user data:", error);
            }
          };
      
          fetchUser();
          setisLoading(false)
      }, [])

    //   if (isLoading) {
    //     return <Loader />; // Show loader while checking auth state
    // }

    return (
        <>
            {!user ? <Navbar />: <Navbar1/>}
            <Routes>
                <Route
                    path="/"
                    element={user ? <UserHome /> : <Navigate to="/login/user" />}
                />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/myProfile" element={<ViewMyProfile />} />
                <Route path="/profile" element={<ViewProfile />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/notification" element={<Notification />} />

                <Route path="/chat" element={<Chat />} />
                <Route
                    path="/login/user"
                    element={!user ? <UserLogin /> : <Navigate to="/" />}
                />
                <Route
                    path="/signup"
                    element={!user ? <Signup /> : <Navigate to="/" />}
                />
                <Route path="/login/alumni" element={user? <Navigate to="/alumniDashboard" />: <AlumniLogin />} />
                <Route path="/login/admin" element={user ? <Navigate to="/adminDashboard" />: <AdminLogin />} />
                <Route
                    path="/adminDashboard"
                    element={user ? <AdminDashboard /> : <Navigate to="/login/admin" />}
                />
                <Route path="/analytics" element={<AdminAnalytics />} />
                <Route path="/alumni-requests" element={<AdminAlumniRequests />} />
                <Route
                    path="/alumniDashboard"
                    element={user ? <AlumniDashboard /> : <Navigate to="/login/alumni" />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/view-student-profile" element={<ViewStudentProfile />} />
                <Route path="/update-student-profile" element={<UpdateStudentProfile />} />

            </Routes>
        </>
    );
};

export default App;
