import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";
import { 
    Calendar, 
    X, 
    CreditCard,
    CreditCard as StripeIcon,
    CreditCard as PaypalIcon
} from "lucide-react";

const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

function SameDayCards() {
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paypal'
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [paypalAvailable, setPaypalAvailable] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        description: "",
        price: "",
        type:"",
        cancellationPolicy: "",
        alt: ""
    });

    // Date detection logic
    const isOnBreak = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        
        return currentMonth === 7 && currentDay >= 20 && currentDay <= 31; // July 20-31
    };

    const getDeliveryMessage = () => {
        if (isOnBreak()) {
            return "Your order will be delivered post Aug 1";
        }
        return "Your order will be delivered within 5-7 days of purchase";
    };

    const getLiveDeliveryMessage = () => {
        if (isOnBreak()) {
            return "Delivery post Aug 1. Reading is a first come, first serve within the next few business days";
        }
        return "Delivery within 5-7 days. Reading is a first come, first serve within the next few business days";
    };

    // Check PayPal availability on component mount - TEMPORARILY DISABLED
    useEffect(() => {
        // const checkPayPalAvailability = async () => {
        //     try {
        //         const response = await fetch(`${API_URL}/api/test-paypal`);
        //         const result = await response.json();
        //         setPaypalAvailable(result.success);
        //     } catch (error) {
        //         // PayPal not available
        //         setPaypalAvailable(false);
        //     }
        // };
        
        // checkPayPalAvailability();
        setPaypalAvailable(false); // Temporarily disable PayPal
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const openModal = (title, description, price,type, cancellationPolicy, alt, extrainfo) => {
        setModalContent({ title, description, price,type, cancellationPolicy, alt, extrainfo });
        setPaymentMethod('stripe'); // Reset to default payment method
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const cards = [
        {
            img: "sameday-1.jpg",
            type: "Express reading",
            title: "PRE-RECORDED Reading",
            description: "For those who are in need of immediate guidance and clarity. Allow me to provide you with insight on your next steps. " + getDeliveryMessage() + ". Please note this is a PRE-RECORDED DIGITAL FILE that will be emailed to you.",
            price: "295",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention.",
            extrainfo: isOnBreak() ? "Delivery post Aug 1" : "Delivery within 5-7 days",
            paypalLink: "https://www.paypal.com/ncp/payment/5X34KQX2VWHRS"
        },
        {
            img: "sameday-2.jpg",
            type: "Express reading",
            title: "LIVE one-on-one Emergency 45-minute reading",
            description: "For those who are in need of immediate guidance and clarity and want to talk virtually face-to-face.This will be either a Zoom or Instagram call, scheduled on a first come, first serve basis within the next few business days " + getLiveDeliveryMessage(),
            price: "475",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention.",
            extrainfo: isOnBreak() ? "Delivery post Aug 1. Reading is a first come, first serve within the next few business days" : "Delivery within 5-7 days. Reading is a first come, first serve within the next few business days",
            paypalLink: "https://www.paypal.com/ncp/payment/PC7YZCRU5GDX8"
        }
    ];

    const makePayment = async () => {
        if (paymentMethod === 'stripe') {
            setIsProcessing(true);
            setError(null);
            
            try {
        const stripe = await stripePromise;

        const body = {
            productName: modalContent.title,
            userPrice: modalContent.price
        };

        const headers = {
            "Content-Type": "application/json"
        };

        const response = await fetch(`${API_URL}/api/create-checkout-session`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
                    // Payment error
                    setError(result.error.message);
                }
            } catch (err) {
                setError("Payment processing failed. Please try again.");
                console.error("Payment error:", err);
            } finally {
                setIsProcessing(false);
            }
        } else if (paymentMethod === 'paypal') {
            // PayPal functionality temporarily disabled
            setError("PayPal is temporarily unavailable. Please use Stripe for payments.");
            return;
            
            // if (!paypalAvailable) {
            //     setError("PayPal is currently unavailable. Please use Stripe for payments.");
            //     return;
            // }
            
            // setIsProcessing(true);
            // setError(null);
            
            // try {
            //     const body = {
            //         productName: modalContent.title,
            //         userPrice: modalContent.price
            //     };

            //     const headers = {
            //         "Content-Type": "application/json"
            //     };

            //     const response = await fetch(`${API_URL}/api/create-paypal-order`, {
            //         method: "POST",
            //         headers: headers,
            //         body: JSON.stringify(body)
            //     });

            //     const result = await response.json();

            //     if (result.approvalUrl) {
            //         window.location.href = result.approvalUrl;
            //     } else if (result.error) {
            //         setError(result.error);
            //     } else {
            //         setError("Failed to create PayPal order. Please try again.");
            //     }
            // } catch (err) {
            //     setError("PayPal payment processing failed. Please try again.");
            //     console.error("PayPal payment error:", err);
            // } finally {
            //     setIsProcessing(false);
            // }
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-5xl font-extrabold text-white mb-6 md:mb-12"
                >
                    Express Reading
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.filter(price => price.type === "Express reading").map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: "easeInOut",
                                delay: index * 0.2 
                            }}
                            className="bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-1"
                        >
                            <div className="relative bg-white">
                                <img 
                                    className="w-full h-64 object-cover" 
                                    src={card.img} 
                                    alt={card.type} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg sm:text-xl font-bold text-white">{card.title}</h2>
                                </div>
                                
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                                    {card.description}
                                </p>
                                <div className="flex flex-row items-center justify-between">
                                    <button
                                        onClick={() => openModal(card.title, card.description, card.price,card.type, card.cancellationPolicy,card.type,card.extrainfo)}
                                        className="w-[7.5rem] sm:w-40 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Book Now
                                    </button>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                                        ${card.price}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-4">
                                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="relative bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-xl md:rounded-2xl w-full h-full md:h-auto md:max-w-2xl md:mx-4 shadow-2xl border border-gray-800 md:max-h-[90vh] flex flex-col"
                    >
                      <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200">
                                          {modalContent.title}
                                        </h2>
                                        <button
                                          onClick={closeModal}
                                          className="text-gray-400 hover:text-gray-200 transition-colors"
                                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                      </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                          <div className="space-y-3 sm:space-y-4 md:space-y-5">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />
                                            </div>
                              <span className="text-sm sm:text-base text-gray-300">Reading Type: {modalContent.type}</span>
                                          </div>
                                          
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                                            </div>
                              <span className="text-sm sm:text-base text-gray-300">
                                              Price: ${modalContent.price}
                                            </span>
                                          </div>
                                        </div>
                      
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-base sm:text-lg font-medium text-gray-200">
                                            Important Notes
                                          </h3>
                            <ul className="text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-3">
                                            {[
                                              "Private, one-on-one LIVE reading session",
                                              "No pre-recordings available",
                                              "Cancellations allowed up to 1 day before",
                                              "Late arrivals may result in session cancellation"
                                            ].map((item, i) => (
                                              <li key={i} className="flex items-start space-x-2">
                                                <div className="w-1 h-1 rounded-full bg-gray-500 mt-2"></div>
                                                <span>{item}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                      
                        <div className="mt-6 sm:mt-8 bg-gray-800/40 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-gray-700/30">
                          <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-3">
                                          Cancellation Policy
                                        </h4>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                          {modalContent.cancellationPolicy}
                                        </p>
                                      </div>
                      
                        {/* Break Message */}
                        {isOnBreak() && (
                          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-base sm:text-lg font-medium text-amber-300 mb-2">
                                  Important Notice
                                </h4>
                                <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                                  Taking a short break from July 20-31. All bookings during these period will be delivered post Aug 1.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment Method Selection */}
                        <div className="mt-6 sm:mt-8 bg-gray-800/40 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-gray-700/30">
                          <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-4">
                            Choose Payment Method
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <button
                              onClick={() => setPaymentMethod('stripe')}
                              className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
                                paymentMethod === 'stripe'
                                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                              }`}
                            >
                              <StripeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="font-medium text-sm sm:text-base">Stripe Checkout</span>
                            </button>
                            
                            {paypalAvailable ? (
                              <button
                                onClick={() => setPaymentMethod('paypal')}
                                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
                                  paymentMethod === 'paypal'
                                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                    : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                                }`}
                              >
                                <PaypalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium text-sm sm:text-base">PayPal Checkout</span>
                              </button>
                            ) : (
                              <div className="relative">
                                <button
                                  disabled
                                  className="p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 border-gray-600 bg-gray-700/50 text-gray-300 cursor-not-allowed"
                                >
                                  <PaypalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="font-medium text-sm sm:text-base">PayPal Checkout</span>
                                </button>
                              </div>
                            )}
                          </div>
                          {!paypalAvailable && (
                            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                              <p className="text-xs text-amber-300">
                                PayPal is currently being configured. Please use Stripe for payments.
                              </p>
                            </div>
                          )}
                        </div>
        
                        {error && (
                          <div className="mt-6 sm:mt-8 bg-red-900/30 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-red-300 font-medium text-sm">
                                  {error}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 sm:mt-8 flex flex-row justify-end space-x-4">
                          <button
                            onClick={makePayment}
                            disabled={isProcessing}
                            className="w-full sm:w-40 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </span>
                            ) : (
                              paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Pay with PayPal'
                            )}
                          </button>
                                        <button
                                          onClick={closeModal}
                            disabled={isProcessing}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              )}
            </div>
        </div>
    );
}

export default SameDayCards;