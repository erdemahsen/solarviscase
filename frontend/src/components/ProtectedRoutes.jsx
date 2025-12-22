import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoutes = () => {
    const { user, loading } = useAuth(); // Assuming useAuth provides a loading state

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
