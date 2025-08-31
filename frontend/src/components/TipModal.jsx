import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Plus, DollarSign, CreditCard, AlertCircle, Heart } from 'lucide-react';

const TipModal = ({ 
  showTipModal, 
  setShowTipModal, 
  tipAmount, 
  isCustom, 
  customAmount, 
  setCustomAmount,
  selectPresetAmount, 
  switchToCustomAmount, 
  decreaseAmount,
  increaseAmount,
  handleCustomAmountChange,
  tipMessage,
  setTipMessage,
  paymentMethod,
  setPaymentMethod,
  paypalAvailable,
  error,
  handlePayment,
  isProcessing,
  isValidAmount,
  getFinalAmount
}) => {
  return (
    <>
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 rounded-2xl p-6 md:max-w-md md:w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-400">
                Leave a Tip ✨
              </h3>
              <button 
                onClick={() => setShowTipModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300">
                Your donation helps me keep spreading good vibes and creating magical content!
              </p>
              
              {/* Amount Selection */}
              <div className="space-y-4">
                <p className="text-white text-sm font-medium">Select amount:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map(amount => (
                    <button 
                      key={amount}
                      onClick={() => selectPresetAmount(amount)}
                      className={`py-3 rounded-xl transition-all duration-200 ${
                        tipAmount === amount && !isCustom
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/20' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div 
                  onClick={switchToCustomAmount}
                  className={`flex items-center rounded-xl p-2 border transition-all ${
                    isCustom 
                      ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/30 to-teal-900/30' 
                      : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/30'
                  }`}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      decreaseAmount();
                    }}
                    className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <div className="flex-1 flex items-center px-3">
                    <DollarSign size={16} className="text-gray-400 mr-1" />
                    {isCustom ? (
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-transparent text-center text-white focus:outline-none"
                        placeholder="Enter amount"
                      />
                    ) : (
                      <div className="w-full text-center text-white">{tipAmount}</div>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseAmount();
                    }}
                    className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <p className="text-white text-sm font-medium">Add your message (optional):</p>
                <textarea
                  value={tipMessage}
                  onChange={(e) => setTipMessage(e.target.value)}
                  placeholder="Share your thoughts, gratitude, or any message you'd like to send..."
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-200 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 text-right">
                  {tipMessage.length}/500 characters
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-white text-sm font-medium">Select payment method:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('stripe')}
                    className={`text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
                      paymentMethod === 'stripe'
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg shadow-emerald-900/20'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <CreditCard size={18} className={paymentMethod === 'stripe' ? 'text-emerald-200' : 'text-gray-300'} /> 
                    Stripe
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('paypal')}
                    className={`text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
                      paymentMethod === 'paypal'
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg shadow-emerald-900/20'
                        : 'bg-gray-800 hover:bg-gray-700'
                    } ${!paypalAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!paypalAvailable}
                  >
                    PayPal
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-400 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              <button 
                onClick={handlePayment}
                disabled={isProcessing || !isValidAmount() || !paymentMethod}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg font-medium ${
                  isProcessing || !isValidAmount() || !paymentMethod
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-green-900/30'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Heart size={18} className="text-green-200" /> 
                    Send ${getFinalAmount()} via {paymentMethod === 'stripe' ? 'Stripe' : paymentMethod === 'paypal' ? 'PayPal' : '...'}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by {paymentMethod === 'stripe' ? 'Stripe' : paymentMethod === 'paypal' ? 'PayPal' : 'our payment partners'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TipModal;
