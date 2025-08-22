import SEO from "./SEO";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Coffee, Heart, X, Plus, Minus, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from "../utils/apiConfig";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

const MarinaAbout = () => {
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [tipMessage, setTipMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  // const [copied, setCopied] = useState(false);
  const [paypalAvailable, setPaypalAvailable] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  
  // Check PayPal availability on component mount - TEMPORARILY DISABLED
  useEffect(() => {
    // const checkPayPalAvailability = async () => {
    //   try {
    //     const response = await fetch(`${API_URL}/api/test-paypal`);
    //     const result = await response.json();
    //     setPaypalAvailable(result.success);
    //   } catch (error) {
    //     // PayPal not available
    //     setPaypalAvailable(false);
    //   }
    // };
    
    // checkPayPalAvailability();
    setPaypalAvailable(false); // Temporarily disable PayPal
  }, []);

  // Check for payment success/failure in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const method = urlParams.get('method');
    const type = urlParams.get('type');
    const amount = urlParams.get('amount');
    const error = urlParams.get('error');
    
    if (payment === 'success' && method === 'paypal' && type === 'tip') {
      setPaymentMessage(`Thank you for your $${amount} tip!`);
      setShowSuccessMessage(true);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } else if (payment === 'failed' && method === 'paypal' && type === 'tip') {
      let errorMessage = 'Payment failed. Please try again.';
      if (error === 'capture_failed') {
        errorMessage = 'Payment was not completed. Please try again.';
      } else if (error === 'booking_not_found') {
        errorMessage = 'Payment processing error. Please contact support.';
      } else if (error === 'capture_error') {
        errorMessage = 'Payment processing failed. Please try again.';
      }
      setPaymentMessage(errorMessage);
      setShowErrorMessage(true);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    }
  }, []);

  // const handleCopyVenmo = () => {
  //   navigator.clipboard.writeText('@Marina-Tarot');
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  //   setPaymentMethod('venmo');
  // };

  const handleTip = () => {
    setShowTipModal(true);
    setError(null);
    setPaymentMethod(null);
    setTipMessage("");
  };

  const handleCustomAmountChange = (e) => {
    // Remove non-numeric characters except decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      return;
    }
    setCustomAmount(value);
    setError(null);
  };

  const increaseAmount = () => {
    if (isCustom) {
      const newAmount = parseFloat(customAmount || "0") + 1;
      setCustomAmount(newAmount.toString());
    } else {
      setTipAmount(prev => Math.min(prev + 1, 100));
    }
    setError(null);
  };

  const decreaseAmount = () => {
    if (isCustom) {
      const newAmount = Math.max(parseFloat(customAmount || "0") - 1, 0);
      setCustomAmount(newAmount.toString());
    } else {
      setTipAmount(prev => Math.max(prev - 1, 0));
    }
  };

  const selectPresetAmount = (amount) => {
    setTipAmount(amount);
    setIsCustom(false);
    setError(null);
  };

  const switchToCustomAmount = () => {
    setIsCustom(true);
    setCustomAmount(tipAmount.toString());
    setError(null);
  };

  const getFinalAmount = () => {
    return isCustom ? parseFloat(customAmount || "0") : tipAmount;
  };

  const isValidAmount = () => {
    const amount = getFinalAmount();
    return amount > 0;
  };

  const handleStripePayment = async () => {
    const amount = getFinalAmount();
    
    if (!isValidAmount()) {
      setError("Please select an amount greater than 0");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const stripe = await stripePromise;
  
          const body = {
              productName: 'Thanks for supporting!',
              userPrice: amount,
              message: tipMessage
          };
  
          const headers = {
              "Content-Type": "application/json"
          };
  
          const response = await fetch(`${API_URL}/api/create-checkout-session-tip`, {
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
  };

  const handlePayPalPayment = async () => {
    // PayPal functionality temporarily disabled
    setError("PayPal is temporarily unavailable. Please use Stripe for payments.");
    return;
    
    // const amount = getFinalAmount();
    
    // if (!isValidAmount()) {
    //   setError("Please select an amount greater than 0");
    //   return;
    // }
    
    // if (!paypalAvailable) {
    //   setError("PayPal is currently unavailable. Please use Stripe for payments.");
    //   return;
    // }
    
    // setIsProcessing(true);
    
    // try {
    //   const body = {
    //       productName: 'Thanks for supporting!',
    //       userPrice: amount
    //   };

    //   const headers = {
    //       "Content-Type": "application/json"
    //   };

    //   const response = await fetch(`${API_URL}/api/create-paypal-order-tip`, {
    //       method: "POST",
    //       headers: headers,
    //       body: JSON.stringify(body)
    //   });

    //   const result = await response.json();

    //   if (result.approvalUrl) {
    //       window.location.href = result.approvalUrl;
    //   } else if (result.error) {
    //       setError(result.error);
    //   } else {
    //       setError("Failed to create PayPal order. Please try again.");
    //   }
    // } catch (err) {
    //   setError("PayPal payment processing failed. Please try again.");
    //   console.error("PayPal payment error:", err);
    // } finally {
    //   setIsProcessing(false);
    // }
  };
  
  const handlePayment = () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }
    
    if (!isValidAmount()) {
      setError("Please select an amount greater than 0");
      return;
    }
    
    if (paymentMethod === 'stripe') {
      handleStripePayment();
    } else if (paymentMethod === 'paypal') {
      handlePayPalPayment();
    }
  };
  const handleInsta = (url) => {
    window.open(url, "_blank");
  };

  const handleTiktok = (url) => {
    window.open(url, "_blank");
  }
  return (
    <>
      <SEO 
        title="About Marina - Professional Tarot Reader & Spiritual Guide | The New York Oracle"
        description="Meet Marina, your professional tarot reader and spiritual guide. Discover her journey in intuitive healing, manifestation coaching, and providing insightful tarot readings."
        keywords="Marina tarot reader, spiritual guide, intuitive healer, manifestation coach, professional psychic, tarot reading"
        image="https://thenewyorkoracle.com/soulsticetarot.jpg"
        url="https://thenewyorkoracle.com/about"
      />
    <div className="flex items-center justify-center px-4 py-16 pt-40">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center bg-gray-900/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-[#4a4e69]/20"
      >
        {/* Image Section */}
        <div className="relative group overflow-hidden">
          <img 
            src="soulsticetarot.jpg" 
            alt="Marina - Soulstice Tarot" 
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6 text-white">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            About Marina
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-[1rem] text-gray-500 tracking-wide leading-relaxed"
          >
            Tarot Reader | Intuitive Healer | Manifestation Coach
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 text-sm md:text-[1rem]"
          >
            <p className="text-white/80 leading-loose">
             I offer insightful Tarot Readings to illuminate your path, provide clarity. Longer readings entail empowering you to tap into your inner wisdom, refine your intuition, and manifest your desires.
            </p>
            
            <p className="text-white/80 leading-loose">
              Together, we'll align your energy and unlock your full potential. Just authentic guidance using Tarot, Intuition, and Divine connection. Allow me to help you on your journey and manifest your best life.
            </p>
          </motion.div>
          <div className='pt-10 flex flex-wrap xs:flex-nowrap items-center gap-5 justify-between'>
            {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            <button  onClick={() => handleInsta('https://www.instagram.com/soulstice_tarot')} className="w-10 h-10 flex items-center justify-center rounded-full relative overflow-hidden  group transition-all duration-500">
      <svg className="fill-white relative z-10 transition-all duration-500 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 51" fill="none">
      <path
        d="M17.4456 25.7808C17.4456 21.1786 21.1776 17.4468 25.7826 17.4468C30.3875 17.4468 34.1216 21.1786 34.1216 25.7808C34.1216 30.383 30.3875 34.1148 25.7826 34.1148C21.1776 34.1148 17.4456 30.383 17.4456 25.7808ZM12.9377 25.7808C12.9377 32.8708 18.6883 38.618 25.7826 38.618C32.8768 38.618 38.6275 32.8708 38.6275 25.7808C38.6275 18.6908 32.8768 12.9436 25.7826 12.9436C18.6883 12.9436 12.9377 18.6908 12.9377 25.7808ZM36.1342 12.4346C36.1339 13.0279 36.3098 13.608 36.6394 14.1015C36.9691 14.595 37.4377 14.9797 37.9861 15.2069C38.5346 15.4342 39.1381 15.4939 39.7204 15.3784C40.3028 15.2628 40.8378 14.9773 41.2577 14.5579C41.6777 14.1385 41.9638 13.6041 42.0799 13.0222C42.1959 12.4403 42.1367 11.8371 41.9097 11.2888C41.6828 10.7406 41.2982 10.2719 40.8047 9.94202C40.3112 9.61218 39.7309 9.436 39.1372 9.43576H39.136C38.3402 9.43613 37.5771 9.75216 37.0142 10.3144C36.4514 10.8767 36.1349 11.6392 36.1342 12.4346ZM15.6765 46.1302C13.2377 46.0192 11.9121 45.6132 11.0311 45.2702C9.86323 44.8158 9.02993 44.2746 8.15381 43.4002C7.27768 42.5258 6.73536 41.6938 6.28269 40.5266C5.93928 39.6466 5.53304 38.3214 5.42217 35.884C5.3009 33.2488 5.27668 32.4572 5.27668 25.781C5.27668 19.1048 5.3029 18.3154 5.42217 15.678C5.53324 13.2406 5.94248 11.918 6.28269 11.0354C6.73736 9.86816 7.27888 9.03536 8.15381 8.15976C9.02873 7.28416 9.86123 6.74216 11.0311 6.28976C11.9117 5.94656 13.2377 5.54056 15.6765 5.42976C18.3133 5.30856 19.1054 5.28436 25.7826 5.28436C32.4598 5.28436 33.2527 5.31056 35.8916 5.42976C38.3305 5.54076 39.6539 5.94976 40.537 6.28976C41.7049 6.74216 42.5382 7.28536 43.4144 8.15976C44.2905 9.03416 44.8308 9.86816 45.2855 11.0354C45.6289 11.9154 46.0351 13.2406 46.146 15.678C46.2673 18.3154 46.2915 19.1048 46.2915 25.781C46.2915 32.4572 46.2673 33.2466 46.146 35.884C46.0349 38.3214 45.6267 39.6462 45.2855 40.5266C44.8308 41.6938 44.2893 42.5266 43.4144 43.4002C42.5394 44.2738 41.7049 44.8158 40.537 45.2702C39.6565 45.6134 38.3305 46.0194 35.8916 46.1302C33.2549 46.2514 32.4628 46.2756 25.7826 46.2756C19.1024 46.2756 18.3125 46.2514 15.6765 46.1302ZM15.4694 0.932162C12.8064 1.05336 10.9867 1.47536 9.39755 2.09336C7.75177 2.73156 6.35853 3.58776 4.9663 4.97696C3.57406 6.36616 2.71955 7.76076 2.08097 9.40556C1.46259 10.9948 1.04034 12.8124 0.919069 15.4738C0.795795 18.1394 0.767578 18.9916 0.767578 25.7808C0.767578 32.57 0.795795 33.4222 0.919069 36.0878C1.04034 38.7494 1.46259 40.5668 2.08097 42.156C2.71955 43.7998 3.57426 45.196 4.9663 46.5846C6.35833 47.9732 7.75177 48.8282 9.39755 49.4682C10.9897 50.0862 12.8064 50.5082 15.4694 50.6294C18.138 50.7506 18.9893 50.7808 25.7826 50.7808C32.5759 50.7808 33.4286 50.7526 36.0958 50.6294C38.759 50.5082 40.5774 50.0862 42.1676 49.4682C43.8124 48.8282 45.2066 47.9738 46.5989 46.5846C47.9911 45.1954 48.8438 43.7998 49.4842 42.156C50.1026 40.5668 50.5268 38.7492 50.6461 36.0878C50.7674 33.4202 50.7956 32.57 50.7956 25.7808C50.7956 18.9916 50.7674 18.1394 50.6461 15.4738C50.5248 12.8122 50.1026 10.9938 49.4842 9.40556C48.8438 7.76176 47.9889 6.36836 46.5989 4.97696C45.2088 3.58556 43.8124 2.73156 42.1696 2.09336C40.5775 1.47536 38.7588 1.05136 36.0978 0.932162C33.4306 0.810962 32.5779 0.780762 25.7846 0.780762C18.9913 0.780762 18.138 0.808962 15.4694 0.932162Z"
        fill="" />
      <path
        d="M17.4456 25.7808C17.4456 21.1786 21.1776 17.4468 25.7826 17.4468C30.3875 17.4468 34.1216 21.1786 34.1216 25.7808C34.1216 30.383 30.3875 34.1148 25.7826 34.1148C21.1776 34.1148 17.4456 30.383 17.4456 25.7808ZM12.9377 25.7808C12.9377 32.8708 18.6883 38.618 25.7826 38.618C32.8768 38.618 38.6275 32.8708 38.6275 25.7808C38.6275 18.6908 32.8768 12.9436 25.7826 12.9436C18.6883 12.9436 12.9377 18.6908 12.9377 25.7808ZM36.1342 12.4346C36.1339 13.0279 36.3098 13.608 36.6394 14.1015C36.9691 14.595 37.4377 14.9797 37.9861 15.2069C38.5346 15.4342 39.1381 15.4939 39.7204 15.3784C40.3028 15.2628 40.8378 14.9773 41.2577 14.5579C41.6777 14.1385 41.9638 13.6041 42.0799 13.0222C42.1959 12.4403 42.1367 11.8371 41.9097 11.2888C41.6828 10.7406 41.2982 10.2719 40.8047 9.94202C40.3112 9.61218 39.7309 9.436 39.1372 9.43576H39.136C38.3402 9.43613 37.5771 9.75216 37.0142 10.3144C36.4514 10.8767 36.1349 11.6392 36.1342 12.4346ZM15.6765 46.1302C13.2377 46.0192 11.9121 45.6132 11.0311 45.2702C9.86323 44.8158 9.02993 44.2746 8.15381 43.4002C7.27768 42.5258 6.73536 41.6938 6.28269 40.5266C5.93928 39.6466 5.53304 38.3214 5.42217 35.884C5.3009 33.2488 5.27668 32.4572 5.27668 25.781C5.27668 19.1048 5.3029 18.3154 5.42217 15.678C5.53324 13.2406 5.94248 11.918 6.28269 11.0354C6.73736 9.86816 7.27888 9.03536 8.15381 8.15976C9.02873 7.28416 9.86123 6.74216 11.0311 6.28976C11.9117 5.94656 13.2377 5.54056 15.6765 5.42976C18.3133 5.30856 19.1054 5.28436 25.7826 5.28436C32.4598 5.28436 33.2527 5.31056 35.8916 5.42976C38.3305 5.54076 39.6539 5.94976 40.537 6.28976C41.7049 6.74216 42.5382 7.28536 43.4144 8.15976C44.2905 9.03416 44.8308 9.86816 45.2855 11.0354C45.6289 11.9154 46.0351 13.2406 46.146 15.678C46.2673 18.3154 46.2915 19.1048 46.2915 25.781C46.2915 32.4572 46.2673 33.2466 46.146 35.884C46.0349 38.3214 45.6267 39.6462 45.2855 40.5266C44.8308 41.6938 44.2893 42.5266 43.4144 43.4002C42.5394 44.2738 41.7049 44.8158 40.537 45.2702C39.6565 45.6134 38.3305 46.0194 35.8916 46.1302C33.2549 46.2514 32.4628 46.2756 25.7826 46.2756C19.1024 46.2756 18.3125 46.2514 15.6765 46.1302ZM15.4694 0.932162C12.8064 1.05336 10.9867 1.47536 9.39755 2.09336C7.75177 2.73156 6.35853 3.58776 4.9663 4.97696C3.57406 6.36616 2.71955 7.76076 2.08097 9.40556C1.46259 10.9948 1.04034 12.8124 0.919069 15.4738C0.795795 18.1394 0.767578 18.9916 0.767578 25.7808C0.767578 32.57 0.795795 33.4222 0.919069 36.0878C1.04034 38.7494 1.46259 40.5668 2.08097 42.156C2.71955 43.7998 3.57426 45.196 4.9663 46.5846C6.35833 47.9732 7.75177 48.8282 9.39755 49.4682C10.9897 50.0862 12.8064 50.5082 15.4694 50.6294C18.138 50.7506 18.9893 50.7808 25.7826 50.7808C32.5759 50.7808 33.4286 50.7526 36.0958 50.6294C38.759 50.5082 40.5774 50.0862 42.1676 49.4682C43.8124 48.8282 45.2066 47.9738 46.5989 46.5846C47.9911 45.1954 48.8438 43.7998 49.4842 42.156C50.1026 40.5668 50.5268 38.7492 50.6461 36.0878C50.7674 33.4202 50.7956 32.57 50.7956 25.7808C50.7956 18.9916 50.7674 18.1394 50.6461 15.4738C50.5248 12.8122 50.1026 10.9938 49.4842 9.40556C48.8438 7.76176 47.9889 6.36836 46.5989 4.97696C45.2088 3.58556 43.8124 2.73156 42.1696 2.09336C40.5775 1.47536 38.7588 1.05136 36.0978 0.932162C33.4306 0.810962 32.5779 0.780762 25.7846 0.780762C18.9913 0.780762 18.138 0.808962 15.4694 0.932162Z"
        fill="" />
      <defs>
        <radialGradient id="paint0_radial_7092_54404" cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(7.41436 51.017) scale(65.31 65.2708)">
          <stop offset="0.09" stopColor="#FA8F21" />
          <stop offset="0.78" stopColor="#D82D7E" />
        </radialGradient>
        <radialGradient id="paint1_radial_7092_54404" cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(31.1086 53.257) scale(51.4733 51.4424)">
          <stop offset="0.64" stopColor="#8C3AAA" stopOpacity="0" />
          <stop offset="1" stopColor="#8C3AAA" />
        </radialGradient>
      </defs>
      </svg>
      <div className="absolute top-full left-0 w-full h-full rounded-full bg-gradient-to-bl from-purple-500 via-pink-500 to-yellow-500 z-0 transition-all duration-500 group-hover:top-0"></div>
      </button>
      <button  onClick={() => handleTiktok('https://www.tiktok.com/@soulsticetarot')} className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-full  group transition-all duration-300">
      <svg className="fill-white relative z-10 transition-all duration-300 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 42 47" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M30.6721 17.4285C33.7387 19.6085 37.4112 20.7733 41.1737 20.7592V13.3024C40.434 13.3045 39.6963 13.2253 38.9739 13.0663V19.0068C35.203 19.0135 31.5252 17.8354 28.4599 15.6389V30.9749C28.4507 33.4914 27.7606 35.9585 26.4628 38.1146C25.165 40.2706 23.3079 42.0353 21.0885 43.2215C18.8691 44.4076 16.37 44.9711 13.8563 44.852C11.3426 44.733 8.90795 43.9359 6.81055 42.5453C8.75059 44.5082 11.2295 45.8513 13.9333 46.4044C16.6372 46.9576 19.4444 46.6959 21.9994 45.6526C24.5545 44.6093 26.7425 42.8312 28.2864 40.5436C29.8302 38.256 30.6605 35.5616 30.6721 32.8018V17.4285ZM33.3938 9.82262C31.8343 8.13232 30.8775 5.97386 30.6721 3.68324V2.71387H28.5842C28.8423 4.16989 29.4039 5.5553 30.2326 6.78004C31.0612 8.00479 32.1383 9.04144 33.3938 9.82262ZM11.645 36.642C10.9213 35.6957 10.4779 34.5653 10.365 33.3793C10.2522 32.1934 10.4746 30.9996 11.0068 29.9338C11.5391 28.8681 12.3598 27.9731 13.3757 27.3508C14.3915 26.7285 15.5616 26.4039 16.7529 26.4139C17.4106 26.4137 18.0644 26.5143 18.6916 26.7121V19.0068C17.9584 18.9097 17.2189 18.8682 16.4794 18.8826V24.8728C14.9522 24.39 13.2992 24.4998 11.8492 25.1803C10.3992 25.8608 9.25851 27.0621 8.65394 28.5454C8.04937 30.0286 8.02524 31.6851 8.58636 33.1853C9.14748 34.6855 10.2527 35.9196 11.6823 36.642H11.645Z"
        fill="#FFF" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M28.4589 15.5892C31.5241 17.7857 35.2019 18.9638 38.9729 18.9571V13.0166C36.8243 12.5623 34.8726 11.4452 33.3927 9.82262C32.1372 9.04144 31.0601 8.00479 30.2315 6.78004C29.4029 5.5553 28.8412 4.16989 28.5831 2.71387H23.09V32.8018C23.0849 34.1336 22.6629 35.4304 21.8831 36.51C21.1034 37.5897 20.0051 38.3981 18.7425 38.8217C17.4798 39.2453 16.1162 39.2629 14.8431 38.872C13.57 38.4811 12.4512 37.7012 11.6439 36.642C10.3645 35.9965 9.3399 34.9387 8.7354 33.6394C8.1309 32.3401 7.98177 30.875 8.31208 29.4805C8.64239 28.0861 9.43286 26.8435 10.556 25.9535C11.6791 25.0634 13.0693 24.5776 14.5023 24.5745C15.1599 24.5766 15.8134 24.6772 16.4411 24.8728V18.8826C13.7288 18.9477 11.0946 19.8033 8.86172 21.3444C6.62887 22.8855 4.89458 25.0451 3.87175 27.5579C2.84892 30.0708 2.58205 32.8276 3.10392 35.49C3.62579 38.1524 4.91367 40.6045 6.80948 42.5453C8.90731 43.9459 11.3458 44.7512 13.8651 44.8755C16.3845 44.9997 18.8904 44.4383 21.1158 43.2509C23.3413 42.0636 25.2031 40.2948 26.5027 38.133C27.8024 35.9712 28.4913 33.4973 28.4962 30.9749L28.4589 15.5892Z"
        fill="" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M38.9736 13.0161V11.4129C37.0005 11.4213 35.0655 10.8696 33.3934 9.82211C34.8695 11.4493 36.8229 12.5674 38.9736 13.0161ZM28.5838 2.71335C28.5838 2.42751 28.4968 2.12924 28.4596 1.8434V0.874023H20.8785V30.9744C20.872 32.6598 20.197 34.2738 19.0017 35.4621C17.8064 36.6504 16.1885 37.3159 14.503 37.3126C13.5106 37.3176 12.5311 37.0876 11.6446 36.6415C12.4519 37.7007 13.5707 38.4805 14.8438 38.8715C16.1169 39.2624 17.4805 39.2448 18.7432 38.8212C20.0058 38.3976 21.1041 37.5892 21.8838 36.5095C22.6636 35.4298 23.0856 34.1331 23.0907 32.8013V2.71335H28.5838ZM16.4418 18.8696V17.167C13.3222 16.7432 10.1511 17.3885 7.44529 18.9977C4.73944 20.6069 2.65839 23.0851 1.54131 26.0284C0.424223 28.9718 0.336969 32.2067 1.29377 35.206C2.25057 38.2053 4.195 40.792 6.81017 42.5448C4.92871 40.5995 3.65455 38.1484 3.14333 35.4908C2.63212 32.8333 2.906 30.0844 3.9315 27.5799C4.957 25.0755 6.68974 22.924 8.91801 21.3882C11.1463 19.8524 13.7736 18.9988 16.4791 18.9318L16.4418 18.8696Z"
        fill="" />
      </svg>
      <div className="absolute top-full left-0 w-full h-full rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-black to-red-600 z-0 transition-all duration-500 group-hover:top-0"></div>
      
      </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
           className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border border-emerald-400/20 backdrop-blur-sm"
              onClick={handleTip}
            >
              <Coffee size={18} className="text-emerald-100 text-sm md:text-base" /> Support My Work
            </button>
          </motion.div>

          </div>
        
        </div>
      </motion.div>

      {/* Donation Modal with Modern UI */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-400">Leave a Tip ✨</h3>
              <button 
                onClick={() => setShowTipModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300">Your donation helps me keep spreading good vibes and creating magical content!</p>
              
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

              <p className="text-xs text-gray-500 text-center">Secure payment powered by {paymentMethod === 'stripe' ? 'Stripe' : paymentMethod === 'paypal' ? 'PayPal' : 'our payment partners'}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-emerald-300 mb-2">Payment Successful!</h3>
              <p className="text-emerald-200">{paymentMessage}</p>
            </div>
            
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-red-900 to-red-800 border border-red-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-300 mb-2">Payment Failed</h3>
              <p className="text-red-200">{paymentMessage}</p>
            </div>
            
            <button 
              onClick={() => setShowErrorMessage(false)}
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
    </>
  );
};

export default MarinaAbout;