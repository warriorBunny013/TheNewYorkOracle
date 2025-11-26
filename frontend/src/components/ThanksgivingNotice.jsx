import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ThanksgivingNotice = () => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Check if current date is Nov 26 or Nov 27, 2025 (EST)
    const checkDate = () => {
      // Get current date in EST timezone
      const now = new Date();
      const estDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      
      const year = estDate.getFullYear();
      const month = estDate.getMonth() + 1; // getMonth() returns 0-11
      const day = estDate.getDate();
      
      // Show notice on Nov 26-27, 2025
      if (year === 2025 && month === 11 && (day === 26 || day === 27)) {
        setShowNotice(true);
      } else {
        setShowNotice(false);
      }
    };

    checkDate();
    // Check every hour in case date changes
    const interval = setInterval(checkDate, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  if (!showNotice) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism container with gradient overlay */}
      <div className="relative">
        {/* Animated gradient background layers */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-yellow-400/20 to-amber-500/15 backdrop-blur-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/15 to-transparent"></div>
         */}
        {/* Main glassmorphism container */}
        <div className="relative bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-500/25 backdrop-blur-2xl border-t border-amber-300/30 shadow-[0_-10px_40px_rgba(245,158,11,0.25),0_0_60px_rgba(245,158,11,0.1)]">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>
          
          <div className="w-full mx-auto px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 relative">
            <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-3 md:gap-4 relative w-full">
              <div className="flex-1 text-center px-0.5 sm:px-2 min-w-0 overflow-hidden">
                <p className="text-[12px] sm:text-xs md:text-sm lg:text-base font-medium text-amber-50/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] leading-tight sm:leading-normal break-words sm:whitespace-nowrap">
                  <span className="font-bold text-amber-100 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 bg-clip-text text-transparent">
                    Thanksgiving Notice:
                  </span>{' '}
                  All Emergency 24-48 hr bookings placed today and tomorrow will be expedited this upcoming weekend.
                </p>
              </div>
              
              <button
                onClick={() => setShowNotice(false)}
                className="flex-shrink-0 p-1 sm:p-1.5 md:p-2 lg:p-2.5 rounded-full bg-amber-400/25 hover:bg-amber-400/35 backdrop-blur-md border border-amber-300/40 hover:border-amber-200/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-400/30 active:scale-95"
                aria-label="Close notice"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] text-amber-100 drop-shadow-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThanksgivingNotice;

