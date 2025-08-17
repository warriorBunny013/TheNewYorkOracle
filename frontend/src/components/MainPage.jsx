import SEO from "./SEO";
import React, { useEffect, useState } from 'react';
import About from './About';
import Testimonials from './Testimonials';
import LoveBookingCards from './LoveBookingCards';
import CareerBookingCards from './CareerBookingCards';
import GeneralBookingCards from './GeneralBookingCards';
import MentorshipBookingCards from './MentorshipBookingCards';
import SameDayCards from './SameDayCards';
import FeedbackForm from './FeedbackForm';
import NewsletterPopup from './NewsletterPopup';
import Footer from './Footer';
import Press from './Press';
import { getAllReview } from '../Api/api';
import { Clock, Zap, ArrowRight, PlayCircle, Hourglass,Menu, X, ChevronRight,Coffee,Heart,CreditCard,AlertCircle,Plus,DollarSign,Minus} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from "../utils/apiConfig";
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);


const MainPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paypalAvailable, setPaypalAvailable] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  // Date detection logic
  const isOnBreak = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()+1;
    const currentDay = currentDate.getDate();
    
    return currentMonth === 7 && currentDay >= 20 && currentDay <= 31; // July 20-31
  };

  const getDeliveryTime = () => {
    if (isOnBreak()) {
      return "Aug 1";
    }
    return "5-7 Days";
  };

  const getBreakMessage = () => {
    if (isOnBreak()) {
      return "Taking a short break from July 20-31. All bookings during these period will be delivered post Aug 1.";
    }
    return null;
  };

  const handleResize = () => {
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    getAllReviews();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };

 
  }, []);

  useEffect(()=>{
   // Start animation after component mounts
   setAnimate(true);
    
   // Set up interval for continuous pulse effect
   const interval = setInterval(() => {
     setAnimate(false);
     setTimeout(() => setAnimate(true), 100);
   }, 3000);
   
   return () => clearInterval(interval);
  },[])

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

  const getAllReviews = async () => {
    try {
      let response = await getAllReview();
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Set empty array as fallback
      setReviews([]);
    }
  };

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  // const navigateTo = (id) => {
  //   window.location.hash = `#${id}`;
  //   setIsMenuOpen(false); // Close the menu after navigating
  // };

  const handleContactClick = (e) => {
    const isMobile = window.innerWidth <= 767;

    if (isMobile) {
      e.preventDefault(); // Prevent the default mailto behavior
      setIsPopupVisible(true);
    } else {
      // For non-mobile screens, continue with the default behavior
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      if (isDesktop && !navigator.userAgent.includes("iPhone") && !navigator.userAgent.includes("iPad")) {
        e.preventDefault();
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=info@soulsticetarot.com`, '_blank');
      }
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position
      const sections = ['about', 'services', 'press', 'testimonials'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const navigateTo = (sectionId) => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    setActiveSection(sectionId);
  };

  const navItems = [
    { id: 'about', label: 'About me' },
    { id: 'services', label: 'Services' },
    { id: 'press', label: 'Press & Media' },
    { id: 'testimonials', label: 'Testimonials' }
  ];
  
  // const handleContactClick = (e) => {
  //   // Additional analytics or actions can be added here
  //   console.log('Contact button clicked');
  // };
 const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [tipMessage, setTipMessage] = useState("");

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




      // const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    
    // Window width updated
  // const navigateTo = (sectionId) => {
  //   const element = document.getElementById(sectionId);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };
  useEffect(() => {
    // const handleResize = () => {
    //   // setWindowWidth(window.innerWidth);
    // };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    })
  };
  return (
    <>
      <SEO 
        title="The New York Oracle - Professional Tarot Readings & Spiritual Guidance | Marina Smargiannakis"
        description="Get professional tarot readings and spiritual guidance from The New York Oracle. Featured in Forbes and PopSugar. Express readings, live consultations, and mentorship available. Book your session today."
        keywords="tarot reading, spiritual guidance, psychic reading, New York oracle, Marina Smargiannakis, express reading, live tarot, spiritual consultation, intuitive reading, professional psychic"
        image="https://thenewyorkoracle.com/hero.png"
        url="https://thenewyorkoracle.com/"
      />
      <div className="relative">
      {/* Main Navbar */}
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
             {/* support Button */}
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
                onClick={toggleMenu}
                className="text-white p-2"
                aria-label="Open menu"
              >
                <Menu size={28} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 lg:hidden"
          >
            {/* Close Button */}
            <div className="absolute top-6 right-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="text-white p-2"
              >
                <X size={32} />
              </motion.button>
            </div>

            {/* Menu Content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="h-full flex flex-col justify-center items-center px-4"
            >
              <div className="flex flex-col space-y-8 items-center w-full max-w-xs">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full flex justify-center"
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => navigateTo(item.id)}
                      className="group flex justify-center items-center text-lg font-medium text-white hover:text-purple-300 transition-colors duration-300 text-center"
                    >
                      <span>{item.label}</span>
                      <motion.div
                        initial={{ x: -5, opacity: 0 }}
                        whileHover={{ x: 5, opacity: 1 }}
                        className="ml-2"
                      >
                        <ChevronRight className="text-purple-400" size={20} />
                      </motion.div>
                    </a>
                  </motion.div>
                ))}
            
                {/* Mobile Contact Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: navItems.length * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 w-full flex justify-center"
                >
                  <a
                    href="mailto:info@soulsticetarot.com"
                    onClick={handleContactClick}
                    className="relative text-sm overflow-hidden inline-flex items-center justify-center px-8 py-3 font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="relative z-10">Contact me</span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ opacity: 1 }}
                    />
                  </a>
                </motion.div>
                {/* Mobile Support Button */}
                <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: navItems.length * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full flex justify-center"
            >
            <button
              onClick={handleTip}
              className="flex text-sm items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border border-emerald-400/20 backdrop-blur-sm"
             
            >
              <Coffee size={18} className="text-emerald-100" /> Support My Work
            </button>
            </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  

        {/* HERO SECTION STARTS FROM HERE!! */}
        <div className="bg-black text-white min-h-screen flex items-center overflow-hidden relative">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-[50%] right-[15%] w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8 xl:px-0 pt-28 md:pt-36 xl:pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-0">
          {/* Content Section */}
          <motion.div 
            className="flex flex-col w-full xl:w-1/2 xl:pr-8"
            initial="hidden"
            animate="visible"
          >
            {/* Forbes badge */}
            <motion.div
              variants={contentVariants}
              custom={0}
              className="flex items-center mb-2 gap-2"
            >
              <span className="text-gray-400 text-sm font-medium">Featured in</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <a
                  href="https://www.forbes.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <img src='https://www.regenerativetravel.com/wp-content/uploads/2024/11/forbes-logo.png' alt='forbes' className='w-20'/>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </motion.div>
            </motion.div>
            
            {/* Name */}
            <motion.div 
              variants={contentVariants}
              custom={1}
              className='rubik-wet-paint-regular mb-2 text-white text-lg md:text-xl'
            >
              Marina Smargiannakis
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              variants={contentVariants}
              custom={2}
              className='ultra-regular text-5xl sm:text-6xl md:text-7xl mb-6 text-white leading-tight tracking-tight'
            >
              The New York <br className='hidden md:block'/> Oracle<sup className='text-xs font-mono align-super'>TM</sup>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              variants={contentVariants}
              custom={3}
              className='text-gray-300 text-base md:text-lg max-w-xl mb-8'
            >
              Utilizing tarot, intuition, and channeling guides to give clarity and help manifest your best life.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              variants={contentVariants}
              custom={4}
            >
              <motion.a 
                href="#services" 
                onClick={() => navigateTo('newsletter')} 
                className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative text-white flex items-center gap-2">
                 Book Your Reading
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.a>
            </motion.div>
            
            {/* Ratings and Reviews Section */}
            <motion.div
              variants={contentVariants}
              custom={5}
              className="mt-12 mb-8 md:mb-0"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                          className="relative w-6 h-6"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-25 animate-pulse"></div>
                          <div className="relative w-full h-full rounded-full border-2 border-purple-500 bg-black flex items-center justify-center overflow-hidden transform hover:scale-110 transition-transform duration-200">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">4.9</span>
                        <span className="text-gray-400 text-sm font-medium">(1000+ reviews)</span>
                      </div>
                      <div className="text-purple-400 text-sm font-medium">
                        Verified people
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full px-4 py-1.5 mt-3 sm:mt-0">
                    <div className="flex items-center gap-1">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-gray-300 text-sm">Active Bookings</span>
                    </div>
                  </div>
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                  <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Image Section */}
          <motion.div 
            className="w-full xl:w-1/2 flex justify-center xl:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative max-w-md sm:max-w-lg md:max-w-xl xl:max-w-none">
              {/* Image wrapper with responsive sizing */}
              <div className="aspect-[3/4] w-full max-w-lg md:max-w-xl xl:max-w-xl">
                <img 
                  src='hero.png' 
                  alt='New York Oracle' 
                  className="object-contain h-full rounded-2xl"
                />
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-xl"></div>
                
                {/* Floating animated cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -left-6 top-6 sm:top-1/4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium">Tarot Reading</div>
                      <div className="text-gray-400 text-xs">Spiritual Guidance</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="absolute -right-6 bottom-1/4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium">Intuitive Reading</div>
                      <div className="text-gray-400 text-xs">Clear Guidance</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
        {/* HERO SECTION ENDS FROM HERE!! */}

        <div id="about">
          <About/>
        </div>
        <Press />
        <div id="testimonials">
          {reviews.length > 0 ? (
            <Testimonials reviews={reviews} />
          ) : (
            <p></p>
          )}
        </div>

        <div className='my-10 md:my-20 flex justify-center'>
        <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 rounded-xl shadow-2xl overflow-hidden relative">
      {/* Glass-like background effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-500 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-500 filter blur-3xl"></div>
      </div>
      
      {/* Animated glass border */}
      <div className="absolute inset-0 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div className="flex items-center space-x-2">
              <Zap className={`text-purple-400 h-5 w-5 ${animate ? 'animate-pulse' : ''}`} />
              <span className="text-purple-400 font-medium uppercase tracking-wider text-sm">Elite Instant Access</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Illuminate Your Path <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Instantly</span>
            </h2>
            
            <p className="text-[1rem] md:text-lg text-gray-300 text-lg">
              Skip the queue and receive profound spiritual guidance within days, not months. Urgent questions deserve immediate answers.
            </p>
            
            {getBreakMessage() && (
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.3-.921 1.603-.921 1.902 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-amber-300 font-medium text-sm">
                      {getBreakMessage()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-3 text-gray-200 backdrop-blur-md bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
                <PlayCircle className="h-10 w-10 md:h-5 md:w-5 text-blue-400" />
                <div>
                  <span className="font-semibold">Pre-Recorded Readings</span>
                  <p className="text-xs sm:text-sm mt-2 md:mt-0 text-gray-300">
                    {isOnBreak() 
                      ? "Detailed analysis delivered to your inbox post Aug 1" 
                      : "Detailed analysis delivered to your inbox within 5-7 days"
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-200 backdrop-blur-md bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
                <Clock className="h-10 w-10 md:h-5 md:w-5 text-purple-400" />
                <div>
                  <span className="font-semibold">Live Readings</span>
                  <p className="text-xs sm:text-sm mt-2 md:mt-0 text-gray-300">
                    {isOnBreak() 
                      ? "Priority real-time consultations post Aug 1" 
                      : "Priority real-time consultations within 5-7 days after purchase"
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <a 
  href="#samedayexpress" 
  onClick={(e) => {
    e.preventDefault();
    document.getElementById('samedayexpress')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }}
  className="group text-sm md:text-[1rem] w-full md:w-[70%] lg:w-[50%] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm border border-white/10"
>
  Accelerate Your Journey
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
</a>
            
          </div>
          
          <div className="relative mt-6 flex-shrink-0">
            {/* Animated glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl opacity-50 ${animate ? 'scale-110' : 'scale-100'} transition-all duration-1000`}></div>
            
            {/* Glass orb with animated rings */}
            <div className="relative w-72 h-72 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-white/10">
              {/* Animated pulse rings */}
              <div className={`w-60 h-60 rounded-full border border-purple-500/30 absolute transition-all duration-700 ${animate ? 'scale-105 opacity-100' : 'scale-95 opacity-50'}`}></div>
              <div className={`w-50 h-50 rounded-full border border-blue-500/30 absolute transition-all duration-700 delay-100 ${animate ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}></div>
              
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-white/10">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-transform duration-500 ${animate ? 'scale-110' : 'scale-100'}`}>
                    <Zap className={`h-12 w-12 text-white transition-all duration-300 ${animate ? 'scale-125' : 'scale-100'}`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating time indicators */}
            <div className="absolute -top-4 right-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
              <Hourglass className="h-3 w-3" />
              <span>{getDeliveryTime()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
        <div id="services">
          <LoveBookingCards/>
          <CareerBookingCards />
          <GeneralBookingCards />
          <div id="samedayexpress">
          <SameDayCards />
          </div>
          {/* <MentorshipBookingCards /> */}
        </div>

        <FeedbackForm />
        {/* <div id="newsletter">
          <NewsletterPopup/>
        </div> */}
           
        <Footer />
      </div>

      {/* Mobile-only popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="relative bg-black border border-white text-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto">
            <button className="absolute top-2 right-2 text-white text-2xl font-bold" onClick={closePopup}>
              &times;
            </button>
            <p className="text-md min-w-4 mr-3">Mail to <strong>info@soulsticetarot.com</strong> for any inquiries.</p>
          </div>
        </div>
      )}

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
    </>

  );
}

export default MainPage;
