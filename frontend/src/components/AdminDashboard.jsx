import React, { useEffect, useState } from 'react';
import ManageBookings from './AdminComponents/ManageBookings';
import ManageReviews from './AdminComponents/ManageReviews';
import ManagePrices from './AdminComponents/ManagePrices'; // Import the component
import { getAllReview, logout } from '../Api/api';

function AdminDashboard() {
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('bookings');

  useEffect(() => {
    getAllReviews();
  }, []);

  const getAllReviews = async () => {
    let response = await getAllReview();
    let sortedReviews = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setReviews(sortedReviews);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    // Redirect to login page after logout
    window.location.href = '/adminlogin';
  };

  return (
    <div className="flex bg-gray-800">
      <aside
        className={`fixed top-0 left-0 z-10 w-64 h-full dark:bg-gray-900 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="overflow-y-auto py-4 px-3">
          <ul className="space-y-2 mt-4">
            <li>
              <button
                onClick={() => handlePageChange('bookings')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Manage Bookings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('prices')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Manage Prices</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('reviews')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Manage Reviews</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('newsletter')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Newsletter</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('appointments')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Appointments</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-900 rounded-lg  dark:text-white  text-left"
              >
                <span className="flex-1 ms-3 px-2 py-1 ml-5 mt-6 rounded font-bold text-md  border whitespace-nowrap">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <div className="flex-1 md:ml-64 bg-gray-800 min-h-screen">
        <div className="navbar text-white">
          <div className="flex-1 justify-center">
            <div className="btn btn-ghost text-xl tracking-wide font-bold">Admin Dashboard</div>
          </div>
          <button
            className="p-2 text-white rounded-md md:hidden"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          {activePage === 'bookings' && <ManageBookings />}
          {activePage === 'prices' && <ManagePrices />} {/* Add this line */}
          {activePage === 'reviews' &&
            (reviews.length > 0 ? <ManageReviews reviews={reviews} setReviews={setReviews}/> : <p>Loading...</p>)}
          {activePage === 'newsletter' && <div> Brevo Newsletter Dashboard: <a className='text-blue-700 hover:text-blue-600' href='https://app.brevo.com/marketing-dashboard'> https://app.brevo.com/marketing-dashboard</a> </div>}
          {activePage === 'appointments' && <div> View all appointments Dashboard: <a className='text-blue-700 hover:text-blue-600' href='https://dashboard.appointlet.com/profiles/199018/meetings'> https://dashboard.appointlet.com/profiles/199018/meetings</a> </div>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
