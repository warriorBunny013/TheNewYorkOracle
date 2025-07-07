import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                // Checking authentication...
                const response = await axios.get(`${API_URL}/api/adminpanel/dashboard`, { 
                    withCredentials: true,
                    timeout: 5000
                });
                
                if (response.status === 200) {
                    // Authentication successful
                setIsAuthenticated(true);
                    setError(null);
                }
            } catch (error) {
                // Authentication failed
                setIsAuthenticated(false);
                setError(error.response?.status || 'Network error');
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center mb-4">
                        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
                    </div>
                    <p className="text-gray-400 text-sm">Verifying authentication...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 max-w-md w-full text-center"
                >
                    <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Authentication Error</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        {error === 401 ? 'Session expired. Please log in again.' : 'Unable to verify authentication.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/adminlogin'}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                    >
                        Go to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;
