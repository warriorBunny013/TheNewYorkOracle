import SEO from "./SEO";
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import About from './About';
import Testimonials from './Testimonials';
import LoveBookingCards from './LoveBookingCards';
import CareerBookingCards from './CareerBookingCards';
import GeneralBookingCards from './GeneralBookingCards';
import ExclusiveTierCards from './ExclusiveTierCards';
import SameDayCards from './SameDayCards';
import Footer from './Footer';
import Press from './Press';
import HeroSection from './HeroSection';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import TipModal from './TipModal';
import ContactPopup from './ContactPopup';
import PaymentSuccessModal from './PaymentSuccessModal';
import BreakMessage from './BreakMessage';
import ThanksgivingNotice from './ThanksgivingNotice';
import { getAllReview } from '../Api/api';
import { API_URL } from "../utils/apiConfig";
import { loadStripe } from '@stripe/stripe-js';
import SocialLinks from './SocialLinks';

// Constants
const BREAK_MONTH = 7;
const BREAK_START_DAY = 20;
const BREAK_END_DAY = 31;
const MOBILE_BREAKPOINT = 767;
const SCROLL_THRESHOLD = 20;
const SECTION_OFFSET = 100;
const ANIMATION_INTERVAL = 3000;
const ANIMATION_DELAY = 100;
const SUCCESS_MESSAGE_TIMEOUT = 5000;

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Stripe promise
const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

const MainPage = () => {
  // Refs for performance optimization
  const activeSeactionRef = useRef('');
  const sectionsRef = useRef([]);
  const isScrollingRef = useRef(false);

  // Consolidated state
  const [state, setState] = useState({
    reviews: [],
    isMenuOpen: false,
    isPopupVisible: false,
    animate: false,
    scrolled: false,
    activeSection: '',
    showTipModal: false,
    tipAmount: 5,
    customAmount: "",
    isCustom: false,
    tipMessage: "",
    paymentMethod: null,
    isProcessing: false,
    error: null,
    paypalAvailable: false,
    showSuccessMessage: false,
    showErrorMessage: false,
    paymentMessage: ''
  });

  // Update state helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Cache section elements on mount and when needed
  const cacheSectionElements = useCallback(() => {
    const sections = ['about', 'services', 'press', 'testimonials'];
    sectionsRef.current = sections.map(id => ({
      id,
      element: document.getElementById(id)
    })).filter(section => section.element);
  }, []);

  // Memoized values
  const isOnBreak = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    return currentMonth === BREAK_MONTH && currentDay >= BREAK_START_DAY && currentDay <= BREAK_END_DAY;
  }, []);

  const breakMessage = useMemo(() => {
    if (isOnBreak) {
      return "Taking a short break from July 20-31. All bookings during these period will be delivered post Aug 1.";
    }
    return null;
  }, [isOnBreak]);

  const navItems = useMemo(() => [
    { id: 'about', label: 'About me' },
    { id: 'services', label: 'Services' },
    { id: 'press', label: 'Press & Media' },
    { id: 'testimonials', label: 'Testimonials' }
  ], []);

  const finalAmount = useMemo(() => {
    return state.isCustom ? parseFloat(state.customAmount || "0") : state.tipAmount;
  }, [state.isCustom, state.customAmount, state.tipAmount]);

  const isValidAmount = useCallback(() => finalAmount > 0, [finalAmount]);

  // Optimized scroll handler with throttling and passive listening
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for smooth performance
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrolled = scrollY > SCROLL_THRESHOLD;
        
        // Only update scrolled state if it changed
        if (state.scrolled !== scrolled) {
          updateState({ scrolled });
        }

        // Determine active section using cached elements
        let currentSection = '';
        for (let i = 0; i < sectionsRef.current.length; i++) {
          const { id, element } = sectionsRef.current[i];
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= SECTION_OFFSET && rect.bottom >= SECTION_OFFSET) {
              currentSection = id;
              break;
            }
          }
        }
        
        // Only update active section if it changed
        if (activeSeactionRef.current !== currentSection) {
          activeSeactionRef.current = currentSection;
          updateState({ activeSection: currentSection });
        }

        isScrollingRef.current = false;
      });
    }
  }, [state.scrolled, updateState]);

  // Throttled scroll handler
  const throttledScrollHandler = useMemo(
    () => throttle(handleScroll, 16), // ~60fps
    [handleScroll]
  );

  // Event handlers
  const handleResize = useCallback(() => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (!isMobile && state.isPopupVisible) {
      updateState({ isPopupVisible: false });
    }
    // Recache section elements on resize
    cacheSectionElements();
  }, [state.isPopupVisible, updateState, cacheSectionElements]);

  // Debounced resize handler
  const debouncedResizeHandler = useMemo(
    () => debounce(handleResize, 150),
    [handleResize]
  );

  const toggleMenu = useCallback(() => {
    const newMenuState = !state.isMenuOpen;
    console.log('toggleMenu called, current state:', state.isMenuOpen, 'new state:', newMenuState);
    updateState({ isMenuOpen: newMenuState });
    document.body.style.overflow = newMenuState ? 'hidden' : 'auto';
    console.log('State updated, body overflow set to:', newMenuState ? 'hidden' : 'auto');
  }, [state.isMenuOpen, updateState]);

  const navigateTo = useCallback((sectionId) => {
    updateState({ isMenuOpen: false, activeSection: sectionId });
    document.body.style.overflow = 'auto';
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Use smooth scroll behavior
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [updateState]);

  const handleContactClick = useCallback((e) => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (isMobile) {
      e.preventDefault();
      updateState({ isPopupVisible: true });
    } else {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop && !navigator.userAgent.includes("iPhone") && !navigator.userAgent.includes("iPad")) {
        e.preventDefault();
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=info@soulsticetarot.com`, '_blank');
      }
    }
  }, [updateState]);

  const closePopup = useCallback(() => {
    updateState({ isPopupVisible: false });
  }, [updateState]);

  const handleTip = useCallback(() => {
    updateState({
      showTipModal: true,
      error: null,
      paymentMethod: null,
      tipMessage: ""
    });
  }, [updateState]);

  const handleCustomAmountChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) return;
    
    updateState({ customAmount: value, error: null });
  }, [updateState]);

  const increaseAmount = useCallback(() => {
    if (state.isCustom) {
      const newAmount = parseFloat(state.customAmount || "0") + 1;
      updateState({ customAmount: newAmount.toString(), error: null });
    } else {
      // FIXED: Don't use prev => with updateState, just calculate directly
      const newAmount = Math.min(state.tipAmount + 1, 100);
      updateState({ tipAmount: newAmount, error: null });
    }
  }, [state.isCustom, state.customAmount, state.tipAmount, updateState]);
  

  const decreaseAmount = useCallback(() => {
    if (state.isCustom) {
      const newAmount = Math.max(parseFloat(state.customAmount || "0") - 1, 0);
      updateState({ customAmount: newAmount.toString() });
    } else {
      // FIXED: Don't use prev => with updateState, just calculate directly
      const newAmount = Math.max(state.tipAmount - 1, 0);
      updateState({ tipAmount: newAmount });
    }
  }, [state.isCustom, state.customAmount, state.tipAmount, updateState]);

  const selectPresetAmount = useCallback((amount) => {
    updateState({
      tipAmount: amount,
      isCustom: false,
      error: null
    });
  }, [updateState]);

  const switchToCustomAmount = useCallback(() => {
    updateState({
      isCustom: true,
      customAmount: state.tipAmount.toString(),
      error: null
    });
  }, [state.tipAmount, updateState]);

  const handleStripePayment = useCallback(async () => {
    if (!isValidAmount()) {
      updateState({ error: "Please select an amount greater than 0" });
      return;
    }
    
    updateState({ isProcessing: true });
    
    try {
      const stripe = await stripePromise;
      const body = {
        productName: 'Thanks for supporting!',
        userPrice: finalAmount,
        message: state.tipMessage
      };

      const response = await fetch(`${API_URL}/api/create-checkout-session-tip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        updateState({ error: result.error.message });
      }
    } catch (err) {
      updateState({ error: "Payment processing failed. Please try again." });
      console.error("Payment error:", err);
    } finally {
      updateState({ isProcessing: false });
    }
  }, [finalAmount, state.tipMessage, isValidAmount, updateState]);

  const handlePayPalPayment = useCallback(() => {
    updateState({ error: "PayPal is temporarily unavailable. Please use Stripe for payments." });
  }, [updateState]);

  const handlePayment = useCallback(() => {
    if (!state.paymentMethod) {
      updateState({ error: "Please select a payment method" });
      return;
    }
    
    if (!isValidAmount()) {
      updateState({ error: "Please select an amount greater than 0" });
      return;
    }
    
    if (state.paymentMethod === 'stripe') {
      handleStripePayment();
    } else if (state.paymentMethod === 'paypal') {
      handlePayPalPayment();
    }
  }, [state.paymentMethod, isValidAmount, handleStripePayment, handlePayPalPayment, updateState]);

  // Data fetching
  const getAllReviews = useCallback(async () => {
    try {
      const response = await getAllReview();
      updateState({ reviews: response.data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      updateState({ reviews: [] });
    }
  }, [updateState]);

  // Effects
  useEffect(() => {
    getAllReviews();
    
    // Cache section elements after component mounts
    const timer = setTimeout(cacheSectionElements, 100);
    
    // Add optimized event listeners
    window.addEventListener('resize', debouncedResizeHandler, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, [getAllReviews, debouncedResizeHandler, cacheSectionElements]);

  useEffect(() => {
    updateState({ animate: true });
    const interval = setInterval(() => {
      updateState({ animate: false });
      setTimeout(() => updateState({ animate: true }), ANIMATION_DELAY);
    }, ANIMATION_INTERVAL);
    
    return () => clearInterval(interval);
  }, [updateState]);

  useEffect(() => {
    // Add passive scroll listener for better performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [throttledScrollHandler]);

  useEffect(() => {
    updateState({ paypalAvailable: false });
  }, [updateState]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const { payment, method, type, amount, error } = Object.fromEntries(urlParams);
    
    if (payment === 'success' && method === 'paypal' && type === 'tip') {
      const message = `Thank you for your $${amount} tip!`;
      updateState({ paymentMessage: message, showSuccessMessage: true });
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => updateState({ showSuccessMessage: false }), SUCCESS_MESSAGE_TIMEOUT);
    } else if (payment === 'failed' && method === 'paypal' && type === 'tip') {
      const errorMessages = {
        capture_failed: 'Payment was not completed. Please try again.',
        booking_not_found: 'Payment processing error. Please contact support.',
        capture_error: 'Payment processing failed. Please try again.'
      };
      
      const errorMessage = errorMessages[error] || 'Payment failed. Please try again.';
      updateState({ paymentMessage: errorMessage, showErrorMessage: true });
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => updateState({ showErrorMessage: false }), SUCCESS_MESSAGE_TIMEOUT);
    }
  }, [updateState]);
  return (
    <>
      <SEO 
        title="The New York Oracle - Professional Tarot Readings & Spiritual Guidance | Marina Smargiannakis"
        description="Get professional tarot readings and spiritual guidance from The New York Oracle. Featured in Forbes and PopSugar. Express readings, live consultations, and mentorship available. Book your session today."
        keywords="tarot reading, spiritual guidance, psychic reading, New York oracle, Marina Smargiannakis, express reading, live tarot, spiritual consultation, intuitive reading, professional psychic"
        image="https://thenewyorkoracle.com/hero.webp"
        url="https://thenewyorkoracle.com/"
      />
      
      <div className="relative" style={{ willChange: 'scroll-position' }}>
        <Navbar 
          scrolled={state.scrolled}
          activeSection={state.activeSection}
          navItems={navItems}
          navigateTo={navigateTo}
          handleTip={handleTip}
          handleContactClick={handleContactClick}
          toggleMenu={toggleMenu}
        />
        
        <BreakMessage 
          getBreakMessage={() => breakMessage}
          animate={state.animate}
        />

        <MobileMenu 
          isMenuOpen={state.isMenuOpen}
          toggleMenu={toggleMenu}
          navItems={navItems}
          navigateTo={navigateTo}
          activeSection={state.activeSection}
          handleTip={handleTip}
          handleContactClick={handleContactClick}
        />

        <HeroSection navigateTo={navigateTo} />
        <div id="about" style={{ containment: 'layout style' }}>
          <About/>
        </div>
        <SocialLinks />
        
        <div style={{ containment: 'layout style' }}>
          <Press />
        </div>
        
        <div id="testimonials" style={{ containment: 'layout style' }}>
          {state.reviews.length > 0 && <Testimonials reviews={state.reviews} />}
        </div>

        <div id="services" style={{ containment: 'layout style' }}>
          <ExclusiveTierCards />
          <SameDayCards />
          <LoveBookingCards/>
          <CareerBookingCards />
          <GeneralBookingCards />
        </div>

        <div style={{ containment: 'layout style' }}>
          {/* <FeedbackForm /> */}
          <Footer />
        </div>
      </div>

      <ContactPopup 
        isPopupVisible={state.isPopupVisible}
        closePopup={closePopup}
      />

      <TipModal 
        showTipModal={state.showTipModal}
        setShowTipModal={(show) => updateState({ showTipModal: show })}
        tipAmount={state.tipAmount}
        isCustom={state.isCustom}
        customAmount={state.customAmount}
        setCustomAmount={(amount) => updateState({ customAmount: amount })}
        selectPresetAmount={selectPresetAmount}
        switchToCustomAmount={switchToCustomAmount}
        decreaseAmount={decreaseAmount}
        increaseAmount={increaseAmount}
        handleCustomAmountChange={handleCustomAmountChange}
        tipMessage={state.tipMessage}
        setTipMessage={(message) => updateState({ tipMessage: message })}
        paymentMethod={state.paymentMethod}
        setPaymentMethod={(method) => updateState({ paymentMethod: method })}
        paypalAvailable={state.paypalAvailable}
        error={state.error}
        handlePayment={handlePayment}
        isProcessing={state.isProcessing}
        isValidAmount={isValidAmount}
        getFinalAmount={() => finalAmount}
      />

      <PaymentSuccessModal 
        showSuccessMessage={state.showSuccessMessage}
        showErrorMessage={state.showErrorMessage}
        paymentMessage={state.paymentMessage}
        setShowSuccessMessage={(show) => updateState({ showSuccessMessage: show })}
        setShowErrorMessage={(show) => updateState({ showErrorMessage: show })}
      />

      <ThanksgivingNotice />
    </>
  );
}

export default MainPage;