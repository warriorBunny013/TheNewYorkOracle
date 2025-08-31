import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const BreakMessage = ({ getBreakMessage, animate }) => {
  const breakMessage = getBreakMessage();
  
  if (!breakMessage) return null;

  return (
    <motion.div
      animate={animate ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: animate ? Infinity : 0, repeatDelay: 2 }}
      className="fixed top-24 left-1/2 transform -translate-x-1/2 z-30 bg-amber-600 text-white px-6 py-3 rounded-full shadow-lg border border-amber-400/20"
    >
      <div className="flex items-center gap-3">
        <AlertCircle size={20} className="text-amber-100" />
        <span className="text-sm font-medium">{breakMessage}</span>
      </div>
    </motion.div>
  );
};

export default BreakMessage;
