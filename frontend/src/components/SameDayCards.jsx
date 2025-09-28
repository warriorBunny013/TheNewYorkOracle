import React, { useState, useEffect, useRef } from "react";
import { loadStripe } from '@stripe/stripe-js';
// import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";
import FormBeforePayment from "./FormBeforePayment";
import { 
    Calendar, 
    X, 
    CreditCard,
    Zap,
    PlayCircle,
    Clock,
    Hourglass,
    Sparkles,
    AlertCircle
} from "lucide-react";

const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

function SameDayCards() {
    const [showFormModal, setShowFormModal] = useState(false);
    const [error, setError] = useState(null);

    const [modalContent, setModalContent] = useState({
        title: "",
        description: "",
        price: "",
        type:"",
        cancellationPolicy: "",
        alt: ""
    });

    // Animation state for Elite card
    const [animate, setAnimate] = useState(false);
    const [cardInView, setCardInView] = useState(false);
    const eliteCardRef = useRef(null);

    // Refs for animation elements
    const titleRef = useRef(null);
    const cardRefs = useRef([]);

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




    // Animation useEffect for Elite card
    useEffect(() => {
        // Start animation after component mounts
        setAnimate(true);
        
        // Set up interval for continuous pulse effect
        const interval = setInterval(() => {
            setAnimate(false);
            setTimeout(() => setAnimate(true), 100);
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    // Intersection Observer for Elite card animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setCardInView(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const currentRef = eliteCardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    useEffect(() => {
        if (showFormModal) {
            document.body.style.overflow = 'hidden';
            
            // Add keyboard event listener for Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeFormModal();
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
    }, [showFormModal]);

    const openModal = (title, description, price, type, cancellationPolicy, alt, extrainfo) => {
        setModalContent({ 
            title, 
            description, 
            price, 
            type, 
            cancellationPolicy, 
            alt, 
            extrainfo 
        });
        setError(null); // Clear any previous errors
        setShowFormModal(true); // Show form modal instead of payment modal
    };

    const closeFormModal = () => {
        setShowFormModal(false);
    };

    const cards = [
        {
            img: "sameday-1.webp",
            type: "ELITE",
            title: "PRE-RECORDED Reading",
            description: "For those who are in need of immediate guidance and clarity. Allow me to provide you with insight on your next steps. " + getDeliveryMessage() + ". Please note this is a PRE-RECORDED DIGITAL FILE that will be emailed to you.",
            price: "325",
            cancellationPolicy: "Due to the expedited nature of this service, cancellations are not available. All sales are final",
            extrainfo: isOnBreak() ? "Delivery post Aug 1" : "Delivery within 5-7 days",
            paypalLink: "https://www.paypal.com/ncp/payment/5X34KQX2VWHRS"
        }
    ];

    // Removed makePayment function - now handled by FormBeforePayment component

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

    return (
      
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <style jsx>{`
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                /* Elite Instant Access Card Ribbon Styles */
                .elite-card .ribbon {
                    width: 100px;
                    height: 100px;
                    overflow: hidden;
                    position: absolute;
                    z-index: 50;
                }
                
                .elite-card .ribbon::before,
                .elite-card .ribbon::after {
                    position: absolute;
                    z-index: -1;
                    content: '';
                    display: block;
                    border: 2px solid rgba(34, 197, 94, 0.8);
                }
                
                .elite-card .ribbon span {
                    position: absolute;
                    display: block;
                    width: 160px;
                    padding: 10px 0;
                    background: linear-gradient(135deg, #22c55e, #3b82f6, #2563eb);
                    box-shadow: 
                        0 4px 12px rgba(34, 197, 94, 0.3),
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
              
                }

                /* Top Right Ribbon */
                .elite-card .ribbon-top-right {
                    top: -3px;
                    right: -3px;
                }
                
                .elite-card .ribbon-top-right::before,
                .elite-card .ribbon-top-right::after {
                    border-top-color: transparent;
                    border-right-color: transparent;
                }
                
                .elite-card .ribbon-top-right::before {
                    top: 0;
                    left: 0;
                }
                
                .elite-card .ribbon-top-right::after {
                    bottom: 0;
                    right: 0;
                }
                
                .elite-card .ribbon-top-right span {
                    left: -18px;
                    top: 22px;
                    transform: rotate(45deg);
                }

                /* Hover effect for modern feel */
                .elite-card .ribbon:hover span {
                    background: linear-gradient(135deg, #4ade80, #22c55e, #3b82f6);
                    box-shadow: 
                        0 6px 16px rgba(34, 197, 94, 0.4),
                        0 3px 6px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
                    transform: rotate(45deg) scale(1.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
            <div className="max-w-7xl mx-auto">
                {/* Elite Instant Access Card */}
                <div className="mb-12 md:mb-16">
                    <div 
                        ref={eliteCardRef}
                        className={`elite-card bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 rounded-xl shadow-2xl relative transition-all duration-1000 ease-out ${
                            cardInView 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-12'
                        }`}
                    >
                        {/* Corner Ribbon Badge */}
                        <div className="ribbon ribbon-top-right">
                            <span>ELITE</span>
                        </div>
                        
                        {/* Glass-like background effects */}
                        <div className={`absolute top-0 left-0 w-full h-full opacity-10 transition-all duration-1000 delay-300 ${
                            cardInView ? 'opacity-10' : 'opacity-0'
                        }`}>
                            <div className={`absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-green-500 filter blur-3xl transition-all duration-1000 delay-500 ${
                                cardInView ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                            }`}></div>
                            <div className={`absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-500 filter blur-3xl transition-all duration-1000 delay-700 ${
                                cardInView ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                            }`}></div>
                        </div>
                        
                        {/* Animated glass border */}
                        <div className={`absolute inset-0 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 transition-all duration-1000 delay-200 ${
                            cardInView ? 'opacity-100' : 'opacity-0'
                        }`}></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row sm:p-5 items-center justify-between gap-16">
                                <div className={`space-y-6 flex-1 max-w-xl transition-all duration-1000 delay-300 ${
                                    cardInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                }`}>
                                    <div className={`flex items-center space-x-2 transition-all duration-700 delay-400 ${
                                        cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}>
                                        <Zap className={`text-green-400 h-5 w-5 transition-all duration-700 delay-500 ${
                                            animate ? 'animate-pulse' : ''
                                        } ${cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
                                        <span className={`text-green-400 font-medium uppercase tracking-wider text-sm transition-all duration-700 delay-500 ${
                                            cardInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                        }`}>Elite Access</span>
                                    </div>
                                    
                                    <h2 className={`text-3xl md:text-5xl font-bold leading-tight transition-all duration-700 delay-600 ${
                                        cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                    }`}>
                                        Within a Week<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"><br></br> Divine Reading</span>
                                    </h2>
                                    
                                    <p className={`text-[1rem] md:text-lg text-gray-300 text-lg transition-all duration-700 delay-700 ${
                                        cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}>
                                        Skip the queue and receive profound spiritual guidance within days, not months. Urgent questions deserve immediate answers.
                                    </p>
                                    
                                    <div className={`space-y-6 transition-all duration-700 delay-900 ${
                                        cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}>
                                        <div className="flex items-center space-x-3 text-gray-200 backdrop-blur-md bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
                                            <PlayCircle className="h-10 w-10 md:h-5 md:w-5 text-blue-400" />
                                            <div>
                                                <span className="font-semibold">Pre-Recorded Readings</span>
                                                <p className="text-xs sm:text-sm mt-2 md:mt-0 text-gray-300">
                                                    Detailed analysis delivered to your inbox within 5-7 days
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* <div className="flex items-center space-x-3 text-gray-200 backdrop-blur-md bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
                                            <Clock className="h-10 w-10 md:h-5 md:w-5 text-green-400" />
                                            <div>
                                                <span className="font-semibold">Live Readings</span>
                                                <p className="text-xs sm:text-sm mt-2 md:mt-0 text-gray-300">
                                                    Priority real-time consultations within 5-7 days after purchase
                                                </p>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                
                                <div className={`relative mt-6 flex-shrink-0 transition-all duration-1000 delay-500 ${
                                    cardInView ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
                                }`}>
                                    {/* Animated glow effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-full blur-3xl opacity-50 transition-all duration-1000 delay-600 ${
                                        animate ? 'scale-110' : 'scale-100'
                                    } ${cardInView ? 'opacity-50' : 'opacity-0'}`}></div>
                                    
                                    {/* Glass orb with animated rings */}
                                    <div className="relative w-72 h-72 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-white/10">
                                        {/* Animated pulse rings */}
                                        <div className={`w-60 h-60 rounded-full border border-green-500/30 absolute transition-all duration-700 delay-700 ${
                                            animate ? 'scale-105 opacity-100' : 'scale-95 opacity-50'
                                        } ${cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
                                        <div className={`w-50 h-50 rounded-full border border-blue-500/30 absolute transition-all duration-700 delay-800 ${
                                            animate ? 'scale-110 opacity-100' : 'scale-90 opacity-50'
                                        } ${cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
                                        
                                        <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all duration-700 delay-900 ${
                                            cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                        }`}>
                                            <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center border border-white/10 transition-all duration-700 delay-1000 ${
                                                cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                            }`}>
                                                <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg shadow-green-500/50 transition-all duration-500 delay-1100 ${
                                                    animate ? 'scale-100' : 'scale-100'
                                                } ${cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                                    <Zap className={`h-12 w-12 text-white transition-all duration-300 delay-1200 ${
                                                        animate ? 'scale-125' : 'scale-100'
                                                    } ${cardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating time indicators */}
                                    <div className={`absolute -top-4 right-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse transition-all duration-700 delay-1200 ${
                                        cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}>
                                        <Hourglass className="h-3 w-3" />
                                        <span>5-7 Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.filter(price => price.type === "ELITE").map((card, index) => (
                        <div
                            key={index}
                            ref={(el) => addCardRef(el, index)}
                            className="bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-1 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="relative">
                                <img 
                                    className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-105" 
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
                                        className="w-[7.5rem] sm:w-40 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Book Now
                                    </button>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                                        ${card.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Form Before Payment Modal */}
                <FormBeforePayment
                    isOpen={showFormModal}
                    onClose={closeFormModal}
                    productName={modalContent.title}
                    price={modalContent.price}
                    productType="elite"
                    description={modalContent.description}
                    cancellationPolicy={modalContent.cancellationPolicy}
                />
            </div>
        </div>
    );
}

export default SameDayCards;