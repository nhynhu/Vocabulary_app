import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    // Allow all access (guest and authenticated users)
    return children;
};

export default ProtectedRoute;