import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${API_URL}/api/adminpanel/dashboard`, { withCredentials: true });
                setIsAuthenticated(true);
                console.log("NOOO error while going to adminpanel")
            } catch (error) {
                setIsAuthenticated(false);
                console.log("error while going to adminpanel")
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/adminlogin" />;
};

export default ProtectedRoute;
