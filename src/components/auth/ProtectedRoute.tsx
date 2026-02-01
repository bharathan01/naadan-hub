import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('user' | 'seller' | 'admin')[];
    fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    fallbackPath = '/login'
}) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If not logged in
    if (!user) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }

    // If role is restricted
    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // If trying to access admin dashboard but not an admin
        if (allowedRoles.includes('admin') && profile.role !== 'admin') {
            return <Navigate to="/admin-login" replace />;
        }

        // Default fallback for unauthorized role
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
