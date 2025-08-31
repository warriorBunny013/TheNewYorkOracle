import React, { useState, useEffect, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { 
  Calendar, 
  Clock, 
  X, 
  CreditCard,
  BadgeCheck,
  Users
} from "lucide-react";

// Move cards data outside component to prevent recreation
const cards = [
  {
      img: "Image-6.webp",
      type: "love",
      title: "15 minutes detailed reading",
      description: "15 minutes in-depth and honest insight regarding love-related issues like soulmates, marriage, partnerships, and more.",
      price: "85",
      time: "15 min",
      cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price.",
      gradient: "from-pink-500 to-rose-600",
      buttonGradient: "from-pink-500 to-purple-600",
      priceGradient: "from-rose-400 to-purple-300"
  },
  {
      img: "Image.webp",
      type: "love",
      title: "30 minutes detailed reading",
      description: "30 minutes in-depth and honest insight regarding love-related issues like soulmates, marriage, partnerships, and more.",
      price: "150",
      time: "30 min",
      cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price.",
      gradient: "from-pink-500 to-rose-600",
      buttonGradient: "from-pink-500 to-purple-600",
      priceGradient: "from-rose-400 to-purple-300"
  },
  {
      img: "Image-1.webp",
      type: "love",
      title: "45 minutes detailed reading",
      description: "45 minutes in-depth and honest insight regarding love-related issues like soulmates, marriage, partnerships, and more.",
      price: "225",
      time: "45 min",
      cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price.",
      gradient: "from-pink-500 to-rose-600",
      buttonGradient: "from-pink-500 to-purple-600",
      priceGradient: "from-rose-400 to-purple-300"
  }
];

// Move styles to a constant to prevent recreation
const styles = `
  .card-glow {
      box-shadow: 0 0 5px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.1);
  }
  
  .card-light {
      position: relative;
  }
  
  .card-light::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: -1;
  }
  
  .card-light:hover::before {
      opacity: 1;
  }
  
  .mystical-text {
      background: linear-gradient(135deg, #ec4899, #be185d, #9d174d, #831843);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
  }
  
  .mystical-glow {
      text-shadow: 0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3);
  }
  
  @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
  }
  
  .float-animation {
      animation: float 3s ease-in-out infinite;
  }
  
  .float-animation-delay-1 {
      animation-delay: 1s;
  }
  
  .float-animation-delay-2 {
      animation-delay: 2s;
  }

  .animate-fade-up {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.7s ease-out;
  }

  .animate-fade-up.show {
      opacity: 1;
      transform: translateY(0);
  }

  /* Modern Corner Ribbon Styles */
  .ribbon {
      width: 100px;
      height: 100px;
      overflow: hidden;
      position: absolute;
      z-index: 50;
  }
  
  .ribbon::before,
  .ribbon::after {
      position: absolute;
      z-index: -1;
      content: '';
      display: block;
      border: 2px solid rgba(236, 72, 153, 0.8);
  }
  
  .ribbon span {
      position: absolute;
      display: block;
      width: 160px;
      padding: 10px 0;
      background: linear-gradient(135deg, #ec4899, #be185d, #9d174d);
      box-shadow: 
          0 4px 12px rgba(236, 72, 153, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      color: #fff;
      font-weight: 800;
      font-size: 10px;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 1px;
      white-space: nowrap;
      border-radius: 2px;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
  }

  /* Top Right Ribbon */
  .ribbon-top-right {
      top: -3px;
      right: -3px;
  }
  
  .ribbon-top-right::before,
  .ribbon-top-right::after {
      border-top-color: transparent;
      border-right-color: transparent;
  }
  
  .ribbon-top-right::before {
      top: 0;
      left: 0;
  }
  
  .ribbon-top-right::after {
      bottom: 0;
      right: 0;
  }
  
  .ribbon-top-right span {
      left: -18px;
      top: 22px;
      transform: rotate(45deg);
  }

  /* Hover effect for modern feel */
  .ribbon:hover span {
      background: linear-gradient(135deg, #f472b6, #ec4899, #be185d);
      box-shadow: 
          0 6px 16px rgba(236, 72, 153, 0.4),
          0 3px 6px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
      transform: rotate(45deg) scale(1.02);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

function LoveBookingCards() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    price: "",
    time:"",
    cancellationPolicy: "",
    alt: ""
  });
  const [animationsTriggered, setAnimationsTriggered] = useState(false);

  // Refs for animation elements
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      
      // Add keyboard event listener for Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationsTriggered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe title
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    // Observe cards
    cardRefs.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Add ref to card
  const addCardRef = (el, index) => {
    cardRefs.current[index] = el;
  };

  const openModal = (title, description, price, time, cancellationPolicy, alt) => {
    setModalContent({ title, description, price, time, cancellationPolicy, alt });
    setShowModal(true);
    
    // Focus the close button after modal opens
    setTimeout(() => {
      const closeButton = document.querySelector('[aria-label="Close modal"]');
      if (closeButton) {
        closeButton.focus();
      }
    }, 100);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const bookingLinks = {
    "15 minutes detailed reading":
      "https://calendly.com/solsticetarot143/15-minutes-detailed-reading",
    "30 minutes detailed reading":
      "https://calendly.com/solsticetarot143/30-minutes-detailed-reading",
    "45 minutes detailed reading":
      "https://calendly.com/solsticetarot143/45-minutes-detailed-reading"
  };

  const handleBookingRedirect = (duration) => {
    const bookingUrl = bookingLinks[duration];
    if (bookingUrl) {
      window.location.href = bookingUrl;
    } else {
      alert("Booking link not available for this duration.");
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        ${styles}
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Added from updated component */}
        <div className="mb-12 md:mb-16">
          {/* Main Hero Card */}
          <div className={`bg-gradient-to-br from-gray-900/60 to-gray-950/60 rounded-3xl border border-gray-800/50 overflow-hidden shadow-2xl mb-8 card-glow animate-fade-up ${animationsTriggered ? 'show' : ''}`}>
            {/* Corner Ribbon Badge */}
            <div className="ribbon ribbon-top-right">
              <span>Standard</span>
            </div>
            <div className="relative p-8 md:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-700 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-800 rounded-full blur-lg"></div>
              </div>
              
              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className={`inline-flex items-center gap-2`} style={{ transitionDelay: '100ms' }}>
                    <BadgeCheck className="w-4 h-4 text-pink-400" />
                    <span className="text-pink-300 text-sm font-semibold">STANDARD QUEUE</span>
                  </div>
                  
                  <h1 
                    className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight animate-fade-up ${animationsTriggered ? 'show' : ''}`}
                    style={{ transitionDelay: '200ms' }}
                  >
                    Discover Your Path
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-700">
                      Join the Queue
                    </span>
                  </h1>
                  
                  <p className={`text-md md:text-lg text-gray-300 leading-relaxed animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '300ms' }}>
                    Gain deep insights into your life with personalized readings about 
                    <span className="text-pink-400 font-semibold"> love, career, or general insights</span>.
                  </p>
                  
                  {/* Quick Stats */}
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '400ms' }}>
                    {/* <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-700 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Love Focused</div>
                        <div className="text-gray-400 text-xs">Relationship Insights</div>
                      </div>
                    </div> */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-700 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Personal Sessions</div>
                        <div className="text-gray-400 text-xs">One-on-One Reading</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Content - Lottie Animation */}
                <div className={`flex justify-center lg:justify-end animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '500ms' }}>
                  <div className="relative">
                    <div className="w-64 h-64 md:w-80 md:h-80">
                      <DotLottieReact
                        src="https://lottie.host/62dccfaf-08ed-4851-a9b9-9b5b7ef45b99/jsMaMo2IRC.lottie"
                        loop
                        autoplay
                      />
                    </div>
                    {/* Glowing effect around lottie */}
                    {/* <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full animate-pulse"></div> */}
                    
                    {/* Floating elements */}
                    {/* <div className="absolute top-8 right-8 w-3 h-3 bg-pink-400 rounded-full animate-pulse float-animation"></div>
                    <div className="absolute bottom-12 left-8 w-2 h-2 bg-pink-300 rounded-full animate-pulse float-animation-delay-1"></div>
                    <div className="absolute top-1/2 left-4 w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse float-animation-delay-2"></div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Original Title */}
        <h1
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 lg:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 text-center md:text-left opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          Love Readings
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
          {cards
            .filter((price) => price.type === "love")
            .map((card, index) => (
              <div
                key={index}
                ref={(el) => addCardRef(el, index)}
                className="bg-gray-900/40 rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    className="w-full h-48 sm:h-56 md:h-64 object-cover filter saturate-75 transition-transform duration-300 hover:scale-105"
                    src={card.img}
                    alt={card.type}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-200 leading-tight">
                      {card.title}
                    </h2>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className="flex flex-row pt-5 items-center justify-between gap-3 sm:gap-0">
                    <button
                      onClick={() =>
                        openModal(
                          card.title,
                          card.description,
                          card.price,
                          card.time,
                          card.cancellationPolicy,
                          card.type
                        )
                      }
                      className="w-[7.5rem] sm:w-40 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      Book a Slot
                    </button>
                    <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-purple-300">
                      ${card.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
      
            <div 
              className="absolute inset-0 backdrop-blur-sm bg-black/70" 
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <div 
              className="relative bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-xl md:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] shadow-2xl border border-gray-800 flex flex-col"
              role="document"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800">
                <h2 id="modal-title" className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200">
                  {modalContent.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div id="modal-description" className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-300">Reading Type: Love</span>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-300">
                        Duration: {modalContent.time}
                      </span>
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
                    <ul className="text-sm text-gray-400 space-y-2 sm:space-y-3">
                      {[
                        "Private, one-on-one LIVE reading session",
                        "No pre-recordings available",
                        "Cancellations allowed up to 1 day before",
                        "Late arrivals may result in session cancellation"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <div className="w-1 h-1 rounded-full bg-gray-500 mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="mt-6 sm:mt-8 bg-gray-800/40 p-4 sm:p-5 rounded-xl border border-gray-700/30">
                  <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-3">
                    Cancellation Policy
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {modalContent.cancellationPolicy}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-800 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleBookingRedirect(modalContent.title)}
                  className="w-full sm:w-40 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                >
                  Book Now
                </button>
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoveBookingCards;