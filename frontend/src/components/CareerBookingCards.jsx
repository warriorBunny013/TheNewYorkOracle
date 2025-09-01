import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
import { 
    Calendar, 
    Clock, 
    X, 
    CreditCard 
} from "lucide-react";

function CareerBookingCards() {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        description: "",
        price: "",
        time:"",
        cancellationPolicy: "",
        alt: ""
    });

    // Refs for animation elements
    const titleRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
            
            // Add keyboard event listener for Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            };
            
            document.addEventListener('keydown', handleEscape);
            
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

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
        "15-Minute Career Check-In": "https://calendly.com/solsticetarot143/15-minutes-detailed-reading",
        "30-Minute Career Blueprint": "https://calendly.com/solsticetarot143/30-minutes-detailed-reading",
        "45-Minute Career Mastery & Evolution": "https://calendly.com/solsticetarot143/45-minutes-detailed-reading"
    };

    const handleBookingRedirect = (duration) => {
        const bookingUrl = bookingLinks[duration];
        if (bookingUrl) {
            window.location.href = bookingUrl;
        } else {
            alert("Booking link not available for this duration.");
        }
    };
    
    const cards = [
        {
            img: "Image-2.webp",
            type: "career",
            title: "15-Minute Career Check-In",
            description: "Focused guidance on a single career or financial concern to bring quick clarity. Perfect for support on a decision, next step, or immediate opportunity.",
            price: "85",
            time:"15 min",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price."
        },
        {
            img: "Image-3.webp",
            type: "career",
            title: "30-Minute Career Blueprint",
            description: "An in-depth exploration of career direction, finances, and growth opportunities. Allows space to navigate crossroads, challenges, and goals with perspective.",
            price: "150",
            time:"30 min",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price."
        },
        {
            img: "Image-4.webp",
            type: "career",
            title: "45-Minute Career Mastery & Evolution",
            description: "A full-spectrum career reading offering clarity, strategy, and direction. Designed to help you unlock growth, transformation & align with your higher path.",
            price: "225",
            time:"45 min",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price."
        }
    ];

    // Animation variants for smooth scroll animations
    // const containerVariants = {
    //     hidden: { opacity: 0 },
    //     visible: {
    //         opacity: 1,
    //         transition: {
    //             staggerChildren: 0.15,
    //             delayChildren: 0.1
    //         }
    //     }
    // };

    // const cardVariants = {
    //     hidden: { 
    //         opacity: 0, 
    //         y: 50,
    //         scale: 0.95,
    //         filter: "blur(10px)"
    //     },
    //     visible: {
    //         opacity: 1,
    //         y: 0,
    //         scale: 1,
    //         filter: "blur(0px)",
    //         transition: {
    //             duration: 0.8,
    //             ease: [0.25, 0.46, 0.45, 0.94],
    //             type: "spring",
    //             stiffness: 100,
    //             damping: 15
    //         }
    //     }
    // };



    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <style jsx>{`
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                .card-animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `}</style>
              <div className="max-w-7xl mx-auto">
                <h1
                  ref={titleRef}
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 lg:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 text-center md:text-left opacity-0 translate-y-8 transition-all duration-700 ease-out"
                >
                  Career Readings
                </h1>
        
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
                  {cards
                    .filter((price) => price.type === "career")
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
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
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
                              <span className="text-sm sm:text-base text-gray-300">Reading Type: Career</span>
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

export default CareerBookingCards;