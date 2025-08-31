import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Menu } from 'lucide-react';

const Navbar = ({ 
  scrolled, 
  activeSection, 
  navItems, 
  navigateTo, 
  handleTip, 
  handleContactClick, 
  toggleMenu 
}) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`fixed top-0 w-full z-40 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'} transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <img src='logo.png' alt='logo' className="h-12 w-auto" />
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={() => navigateTo(item.id)}
                  className={`relative px-5 py-2 text-white font-medium text-sm transition-all duration-300 rounded-md hover:text-purple-300 ${
                    activeSection === item.id ? 'text-purple-300' : ''
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 mx-4"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </motion.div>
            ))}
          </nav>
          
          <div className='flex gap-4'>
            {/* Support Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:block"
            >
              <button
                onClick={handleTip}
                className="flex text-sm items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border border-emerald-400/20 backdrop-blur-sm"
              >
                <Coffee size={18} className="text-emerald-100" /> Support My Work
              </button>
            </motion.div>
            
            {/* Contact Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:block"
            >
              <a
                href="mailto:info@soulsticetarot.com"
                onClick={handleContactClick}
                className="relative text-sm overflow-hidden inline-flex items-center px-6 py-3 font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span className="relative z-10">Contact me</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                />
              </a>
            </motion.div>
          </div>
          

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu button clicked');
                toggleMenu();
              }}
              className="text-white p-2 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
