import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MobileMenu = ({ 
  isMenuOpen, 
  toggleMenu, 
  navItems, 
  navigateTo, 
  activeSection,
  handleTip,
  handleContactClick
}) => {
  useEffect(() => {
    console.log('MobileMenu: isMenuOpen changed to:', isMenuOpen);
  }, [isMenuOpen]);



  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                console.log('Backdrop clicked');
                toggleMenu();
              }
            }}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-white text-xl font-semibold">Menu</h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Close button clicked');
                    toggleMenu();
                  }}
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer relative"
                  aria-label="Close menu"
                  style={{ zIndex: 1000, pointerEvents: 'auto' }}
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <motion.li
                      key={item.id}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => {
                          navigateTo(item.id);
                          toggleMenu();
                        }}
                        className={`block py-3 px-4 text-white font-medium text-lg transition-all duration-300 rounded-lg hover:bg-white/10 ${
                          activeSection === item.id ? 'bg-purple-600/20 text-purple-300' : ''
                        }`}
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              
              {/* Action Buttons */}
              <div className="p-6 border-t border-white/10 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleTip();
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border border-emerald-400/20"
                >
                  <span>Support My Work</span>
                </motion.button>
                
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="mailto:info@soulsticetarot.com"
                  onClick={() => {
                    handleContactClick();
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center px-6 py-3 rounded-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/20"
                >
                  Contact me
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
