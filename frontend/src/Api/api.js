import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/apiConfig.js';
import 'react-toastify/dist/ReactToastify.css';
axios.defaults.withCredentials = true;
const url = `${API_URL}/api`;


export const logout = async () => {
    try {
      const response = await axios.post(`${url}/admin/logout`, {}, { withCredentials: true });
      
      // Show success message
      toast.success('Logged out successfully');
      
      return response; // Successfully logged out
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed. Please try again.');
      throw err; // Rethrow the error if you need to handle it further up the call chain
    }
  };

  export const getAllReview = async () => {
    try {
      const response = await axios.get(`${url}/getreviews`);
      return response; // Successfully fetched reviews
    } catch (err) {
      console.error('API Error:', err);
      if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.');
      } else if (err.response?.status === 404) {
        toast.error('Reviews endpoint not found.');
      } else if (err.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to fetch reviews. Please try again.');
      }
      throw err; // Rethrow the error for further handling if necessary
    }
  };
  
  export const saveReview = async (details) => {
    try {
      const response = await axios.post(`${url}/savereview`, details);
      return response; // Successfully saved review
    } catch (err) {
      toast.error('Failed to save review. Please check your connection.');
      throw err; // Rethrow the error for further handling if necessary
    }
  };
  
  export const deleteReview = async (id) => {
    try {
      const response = await axios.delete(`${url}/deletereview/${id}`);
      return response; // Successfully deleted review
    } catch (err) {
      toast.error('Failed to delete review. Please check your connection.');
      throw err; // Rethrow the error for further handling if necessary
    }
  };
