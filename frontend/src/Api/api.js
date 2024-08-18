import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
axios.defaults.withCredentials = true;
const url = 'http://localhost:8080/api';


export const logout = async () => {
    try {
      const response = await axios.post('/api/admin/logout', {}, { withCredentials: true });
      return response; // Successfully logged out
    } catch (err) {
      toast.error('Logout failed. Please try again.');
      throw err; // Rethrow the error if you need to handle it further up the call chain
    }
  };

  export const getAllReview = async () => {
    try {
      const response = await axios.get(`${url}/getreviews`);
      return response; // Successfully fetched reviews
    } catch (err) {
      toast.error('Failed to fetch reviews. Please check your connection.');
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
