import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const PaymentSuccessModal = ({ 
  showSuccessMessage, 
  showErrorMessage, 
  paymentMessage, 
  setShowSuccessMessage, 
  setShowErrorMessage 
}) => {
  return (
    <>
      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-100" />
              <div className="flex-1">
                <p className="font-semibold">Success!</p>
                <p className="text-sm text-green-100">{paymentMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-100 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {showErrorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-3">
              <XCircle size={24} className="text-red-100" />
              <div className="flex-1">
                <p className="font-semibold">Error</p>
                <p className="text-sm text-red-100">Payment failed. Please try again.</p>
              </div>
              <button
                onClick={() => setShowErrorMessage(false)}
                className="text-red-100 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaymentSuccessModal;
