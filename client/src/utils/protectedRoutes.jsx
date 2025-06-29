import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ role, children }) => {
    const { user, role: currentRole } = useSelector((state) => state.auth);

    if (!user) {
        // Redirect to login if user is not logged in
        return <Navigate to={`/login/${role}`} />;
    }

    if (role && currentRole !== role) {
        // Redirect to a not-authorized page or homepage if role doesn't match
        return <Navigate to="/kill" />;
    }

    return children; // Render the component if user and role match
};

export default ProtectedRoute;
