import React, { useState, useEffect, useRef } from "react";
import { loadStripe } from '@stripe/stripe-js';
// import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";
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
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paypal'
    const [isProcessing, setIsProcessing] = useState(false);
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

    const getLiveDeliveryMessage = () => {
        if (isOnBreak()) {
            return "Delivery post Aug 1. Reading is a first come, first serve within the next few business days";
        }
        return "Delivery within 5-7 days. Reading is a first come, first serve within the next few business days";
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
        setPaymentMethod('stripe'); // Reset to default payment method
        setError(null); // Clear any previous errors
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

    const cards = [
        {
            img: "sameday-1.webp",
            type: "ELITE",
            title: "PRE-RECORDED Reading",
            description: "For those who are in need of immediate guidance and clarity. Allow me to provide you with insight on your next steps. " + getDeliveryMessage() + ". Please note this is a PRE-RECORDED DIGITAL FILE that will be emailed to you.",
            price: "295",
            cancellationPolicy: "Due to the expedited nature of this service, cancellations are not available. All sales are final",
            extrainfo: isOnBreak() ? "Delivery post Aug 1" : "Delivery within 5-7 days",
            paypalLink: "https://www.paypal.com/ncp/payment/5X34KQX2VWHRS"
        },
        {
            img: "sameday-2.webp",
            type: "ELITE",
            title: "LIVE one-on-one 45-minute reading",
            description: "For those who are in need of immediate guidance and clarity and want to talk virtually face-to-face.This will be either a Zoom or Instagram call, scheduled on a first come, first serve basis within the next few business days " + getLiveDeliveryMessage(),
            price: "495",
            cancellationPolicy: "Due to the expedited nature of this service, cancellations are not available. All sales are final",
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
                                        Within a Week<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"><br></br> Divine reading</span>
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
                                        
                                        <div className="flex items-center space-x-3 text-gray-200 backdrop-blur-md bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
                                            <Clock className="h-10 w-10 md:h-5 md:w-5 text-green-400" />
                                            <div>
                                                <span className="font-semibold">Live Readings</span>
                                                <p className="text-xs sm:text-sm mt-2 md:mt-0 text-gray-300">
                                                    Priority real-time consultations within 5-7 days after purchase
                                                </p>
                                            </div>
                                        </div>
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

                {/* Enhanced Modal - Single Page Design */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
                        
                        <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:mx-4 shadow-2xl border border-gray-800/50 max-h-full sm:max-h-[90vh] flex flex-col overflow-hidden">
                            {/* Enhanced Modal Header */}
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                        {modalContent.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Enhanced Modal Content */}
                            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                                {/* Enhanced Common Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl border border-gray-600/50 backdrop-blur-sm">
                                    <div className="flex items-center space-x-3 group">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">Type</div>
                                            <div className="text-sm font-semibold text-white">{modalContent.type}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 group">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">Delivery</div>
                                            <div className="text-sm font-semibold text-white">5-7 Days</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 group">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">Price</div>
                                            <div className="text-sm font-semibold text-white">${modalContent.price}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Description */}
                                <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-green-400" />
                                        Service Description
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {modalContent.description}
                                    </p>
                                </div>

                                {/* Break Message */}
                                {isOnBreak() && (
                                    <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-medium text-amber-300 mb-2">
                                                    Important Notice
                                                </h4>
                                                <p className="text-amber-200 leading-relaxed">
                                                    Taking a short break from July 20-31. All bookings during these period will be delivered post Aug 1.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Important Notes */}
                                {/* <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm mb-6">
                                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                        <Star className="h-5 w-5 text-amber-400" />
                                        Important Notes
                                    </h4>
                                    <ul className="text-gray-300 text-sm space-y-3">
                                        <li className="flex items-start gap-3 group">
                                            <span className="group-hover:text-amber-200 transition-colors duration-300">Private, one-on-one LIVE reading session</span>
                                        </li>
                                        <li className="flex items-start gap-3 group">
                                            <span className="group-hover:text-amber-200 transition-colors duration-300">No pre-recordings available</span>
                                        </li>
                                        <li className="flex items-start gap-3 group">
                                            <span className="group-hover:text-amber-200 transition-colors duration-300">Please provide accurate information for best results</span>
                                        </li>
                                    </ul>
                                </div> */}

                                {/* Payment Methods */}
                                <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm mb-6">
                                    <h4 className="font-semibold text-white mb-4 flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-green-400" />
                                        Payment Methods
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('stripe')}
                                            className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
                                                paymentMethod === 'stripe'
                                                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                                    : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                                            }`}
                                        >
                                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="font-medium text-sm sm:text-base">Stripe Checkout</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Cancellation Policy */}
                                <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-6 border border-amber-700/50 backdrop-blur-sm mb-6">
                                    <h4 className="font-semibold text-amber-300 mb-4 flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-400" />
                                        Cancellation Policy
                                    </h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {modalContent.cancellationPolicy}
                                    </p>
                                </div>

                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm mb-6">
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
                            </div>

                            {/* Enhanced Modal Footer */}
                            <div className="p-4 sm:p-6 md:p-8 border-t border-gray-800/50 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={makePayment}
                                        disabled={isProcessing}
                                        className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            'Proceed to Booking'
                                        )}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-4 rounded-xl border border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-500/50 transition-all duration-300 font-medium hover:scale-105"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SameDayCards;