import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  BarChart3,
  Mail,
  Clock
} from 'lucide-react';
import ManageTips from './AdminComponents/ManageTips';
import ManageReviews from './AdminComponents/ManageReviews';
import ManagePrices from './AdminComponents/ManagePrices';
import { getAllReview, logout } from '../Api/api';

function AdminDashboard() {
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar state
  const [activePage, setActivePage] = useState('tips');
  // const [stats, setStats] = useState({
  //   totalBookings: 0,
  //   pendingBookings: 0,
  //   completedBookings: 0,
  //   totalRevenue: 0
  // });

  useEffect(() => {
    getAllReviews();
    // Simulate stats - replace with actual API calls
    // setStats({
    //   totalBookings: 156,
    //   pendingBookings: 23,
    //   completedBookings: 133,
    //   totalRevenue: 45230
    // });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle window resize for sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      // On mobile and tablet, always hide sidebar
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAllReviews = async () => {
    try {
    let response = await getAllReview();
    let sortedReviews = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setReviews(sortedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Set empty array as fallback
      setReviews([]);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    // Close sidebar on mobile when changing pages
    if (window.innerWidth < 1024) {
    setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
    await logout();
      
      // Force a hard redirect to clear any cached authentication
      window.location.replace('/adminlogin');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login page
      window.location.replace('/adminlogin');
    }
  };

  const menuItems = [
    { id: 'tips', label: 'Manage Tips', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { id: 'prices', label: 'Manage Prices', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { id: 'reviews', label: 'Manage Reviews', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, color: 'from-orange-500 to-orange-600' },
    { id: 'appointments', label: 'Appointments', icon: Clock, color: 'from-pink-500 to-pink-600' }
  ];

  // const getActiveIcon = (itemId) => {
  //   const IconComponent = menuItems.find(item => item.id === itemId)?.icon;
  //   return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  // };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-80 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:block lg:translate-x-0 lg:animate-none transition-transform duration-300`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 text-sm">The New York Oracle</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 bg-white rounded-full ml-auto"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <motion.button
                onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
              >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:ml-0">
        {/* Header */}
        <header className="bg-gray-800/50 border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors lg:hidden"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
            

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
          {activePage === 'tips' && <ManageTips />}
              {activePage === 'prices' && <ManagePrices />}
          {activePage === 'reviews' &&
            (reviews.length > 0 ? <ManageReviews reviews={reviews} setReviews={setReviews}/> : <p>Loading...</p>)}
              {activePage === 'newsletter' && (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Brevo Newsletter Dashboard</h3>
                  <p className="text-gray-300 mb-4">Manage your email marketing campaigns and subscriber lists.</p>
                  <a 
                    href="https://app.brevo.com/marketing-dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    Open Brevo Dashboard
                  </a>
                </div>
              )}
              {activePage === 'appointments' && (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Appointments Dashboard</h3>
                  <p className="text-gray-300 mb-4">View and manage all your scheduled appointments and meetings.</p>
                  <a 
                    href="https://calendly.com/solsticetarot143" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
                  >
                    <Clock className="w-4 h-4" />
                    Open Appointments Dashboard
                  </a>
        </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
