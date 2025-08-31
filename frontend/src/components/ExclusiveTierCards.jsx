import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from "../utils/apiConfig";
import { 
    Calendar, 
    Clock, 
    X, 
    CreditCard,
    Sparkles,
    Crown,
    Zap,
    Star,
    ArrowRight,
    AlertCircle
} from "lucide-react";

const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

// Move cards data outside component to prevent recreation
const cards = [
    {
        img: "luxereading1.webp",
        type: "exclusive",
        title: "Pre-recorded Emergency Reading",
        description: "A premium pre-recorded reading with personalized attention, deep spiritual connection, and comprehensive guidance. Urgent reading delivered within 24-48 hours. Perfect for those who need immediate answers to pressing questions and can't wait for regular booking slots.",
        price: "395",
        time: "24-48 hours",
        cancellationPolicy: "Due to the expedited nature of this service, cancellations are not available. All sales are final.",
        isLuxury: false,
        gradient: "from-red-500 to-red-800",
        buttonGradient: "from-red-500 to-red-800",
        priceGradient: "from-red-400 to-red-700"
    },
    {
        img: "luxereading2.webp",
        type: "exclusive",
        title: "Live One-on-One 1 hour Reading",
        description: "A premium 1-hour live session with personalized attention, deep spiritual connection, and comprehensive guidance. Urgent reading scheduled within 24-48 hours. Perfect for those who need immediate answers to pressing questions and can't wait for regular booking slots.",
        price: "650",
        time: "24-48 hours",
        cancellationPolicy: "Due to the expedited nature of this service, cancellations are not available. All sales are final",
        isLuxury: true,
        gradient: "from-red-500 to-red-800",
        buttonGradient: "from-red-500 to-red-800",
        priceGradient: "from-red-400 to-red-700"
    }
];

// Move styles to a constant to prevent recreation
const styles = `
    .card-glow {
        box-shadow: 0 0 5px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1);
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
        background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: -1;
    }
    
    .card-light:hover::before {
        opacity: 1;
    }
    
    .mystical-text {
        background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #92400e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .mystical-glow {
        text-shadow: 0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3);
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
        border: 2px solid rgba(220, 38, 38, 0.8);
    }
    
    .ribbon span {
        position: absolute;
        display: block;
        width: 160px;
        padding: 10px 0;
        background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
        box-shadow: 
            0 4px 12px rgba(220, 38, 38, 0.3),
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
        background: linear-gradient(135deg, #f87171, #ef4444, #dc2626);
        box-shadow: 
            0 6px 16px rgba(220, 38, 38, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        transform: rotate(45deg) scale(1.02);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

function ExclusiveTierCards() {
    // Consolidate all modal state into one object
    const [modalState, setModalState] = useState({
        show: false,
        content: {
            title: "",
            description: "",
            price: "",
            time: "",
            cancellationPolicy: "",
            type: ""
        },
        currentPage: 1,
        paymentMethod: 'stripe',
        isProcessing: false,
        error: null
    });
    
    const [animationsTriggered, setAnimationsTriggered] = useState(false);
    const cardRefs = useRef([]);

    useEffect(() => {
        if (modalState.show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [modalState.show]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimationsTriggered(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const addCardRef = (el, index) => {
        cardRefs.current[index] = el;
    };

    const openModal = (title, description, price, time, cancellationPolicy, type) => {
        setModalState(prev => ({
            ...prev,
            show: true,
            content: { title, description, price, time, cancellationPolicy, type },
            currentPage: 1,
            paymentMethod: 'stripe',
            error: null
        }));
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, show: false }));
    };

    const updateModalState = (updates) => {
        setModalState(prev => ({ ...prev, ...updates }));
    };

    const makePayment = async () => {
        if (modalState.paymentMethod !== 'stripe') {
            updateModalState({ error: "PayPal is temporarily unavailable. Please use Stripe for payments." });
            return;
        }

        updateModalState({ isProcessing: true, error: null });
        
        try {
            const stripe = await stripePromise;
            const body = {
                productName: modalState.content.title,
                userPrice: modalState.content.price
            };

            const response = await fetch(`${API_URL}/api/create-checkout-session-premium`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const session = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId: session.id });

            if (result.error) {
                updateModalState({ error: result.error.message });
            }
        } catch (err) {
            updateModalState({ error: "Payment processing failed. Please try again." });
            console.error("Payment error:", err);
        } finally {
            updateModalState({ isProcessing: false });
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            <style jsx>{`                
                ${styles}
            `}</style>
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="mb-12 md:mb-16">
                    {/* Main Hero Card */}
                    <div className={`bg-gradient-to-br from-gray-900/60 to-gray-950/60 backdrop-blur-xl rounded-3xl border border-gray-800/50 overflow-hidden shadow-2xl mb-8 card-glow animate-fade-up ${animationsTriggered ? 'show' : ''}`}>
                        {/* Corner Ribbon Badge */}
                        <div className="ribbon ribbon-top-right">
                            <span>VIP LUXE</span>
                        </div>
                        <div className="relative p-8 md:p-12">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-xl"></div>
                                <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-lg"></div>
                            </div>
                            
                            {/* Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                                {/* Left Content */}
                                <div className="space-y-6">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-500/30 rounded-full animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '100ms' }}>
                                        <Zap className="w-4 h-4 text-red-400" />
                                        <span className="text-red-300 text-sm font-semibold">PREMIUM ACCESS</span>
                                    </div>
                                    
                                    <h1 
                                        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight animate-fade-up ${animationsTriggered ? 'show' : ''}`}
                                        style={{ transitionDelay: '200ms' }}
                                    >
                                        24-48 Hours
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
                                            Instant Answers
                                        </span>
                                    </h1>
                                    
                                    <p className={`text-md md:text-lg text-gray-300 leading-relaxed animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '300ms' }}>
                                        Instant questions need instant answers. Get your urgent guidance delivered within 
                                        <span className="text-red-400 font-semibold"> 24-48 hours</span> instead of waiting a week.
                                    </p>
                                    
                                    {/* Quick Stats */}
                                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '400ms' }}>
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold text-sm">Fast Response</div>
                                                <div className="text-gray-400 text-xs">24-48 Hours</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                                <Crown className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold text-sm">Premium Service</div>
                                                <div className="text-gray-400 text-xs">Exclusive Tier</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Content - Lottie Animation */}
                                <div className={`flex justify-center lg:justify-end animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '500ms' }}>
                                    <div className="relative">
                                        <div className="w-64 h-64 md:w-80 md:h-80">
                                            <DotLottieReact
                                                src="https://lottie.host/cda45751-690f-4e02-8bb4-aa1c373bb08f/UMYxkV6Bal.lottie"
                                                loop
                                                autoplay
                                            />
                                        </div>
                                        {/* Glowing effect around lottie */}
                                        <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                                        
                                        {/* Floating elements */}
                                        <div className="absolute top-8 right-8 w-3 h-3 bg-red-400 rounded-full animate-pulse float-animation"></div>
                                        <div className="absolute bottom-12 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse float-animation-delay-1"></div>
                                        <div className="absolute top-1/2 left-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse float-animation-delay-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Premium Options Cards */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '600ms' }}>
                        {/* Pre-recorded Option */}
                        <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors duration-300">
                                        Pre-Recorded Reading
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                        Get your urgent answers delivered fast with our emergency pre-recorded service
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 text-red-400">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold">EMERGENCY SERVICE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Live One-to-One Option */}
                        <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors duration-300">
                                        Live One-to-One Reading
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                        Premium live session with personalized attention and deep spiritual connection
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 text-red-400">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold">LUXURY EXPERIENCE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            ref={(el) => addCardRef(el, index)}
                            className={`card-light bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-1 hover:card-glow animate-fade-up ${animationsTriggered ? 'show' : ''}`}
                            style={{ transitionDelay: `${700 + index * 100}ms` }}
                        >
                            <div className="relative bg-white overflow-hidden">
                                <img 
                                    className="w-full h-[15rem] lg:h-[21rem] w-full object-cover transition-transform duration-300 hover:scale-105" 
                                    src={card.img} 
                                    alt={card.type} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                
                                {/* Premium Badge */}
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-700 text-gray-100 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg">
                                    <Crown className="h-3 w-3" />
                                    PREMIUM
                                </div>

                                {/* Lottie Diamond Animation for All Cards */}
                                <div className="absolute top-4 right-4 w-20 h-20 pointer-events-none">
                                    <DotLottieReact
                                        src="https://lottie.host/cda45751-690f-4e02-8bb4-aa1c373bb08f/UMYxkV6Bal.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight flex-1">
                                        {card.title}
                                    </h2>
                                </div>
                                
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {card.description}
                                </p>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center`}>
                                            <Clock className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-medium">{card.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center`}>
                                            <Zap className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-medium">Priority Access</span>
                                    </div>
                                </div>

                                <div className="flex flex-row items-center justify-between pt-4">
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
                                        className={`w-[7.5rem] sm:w-40 py-3 rounded-lg bg-gradient-to-r ${card.buttonGradient} text-white font-semibold hover:opacity-90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base`}
                                    >
                                        Book Now
                                    </button>
                                    <span className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${card.priceGradient}`}>
                                        ${card.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Modal */}
            {modalState.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
                    
                    <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:mx-4 shadow-2xl border border-gray-800/50 max-h-full sm:max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Enhanced Modal Header */}
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                    <Crown className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                    {modalState.content.title}
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Enhanced Page Navigation */}
                        <div className="flex border-b border-gray-800/50 bg-gray-900/50">
                            <button
                                onClick={() => updateModalState({ currentPage: 1 })}
                                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                                    modalState.currentPage === 1 
                                        ? 'text-red-400 bg-gradient-to-r from-red-500/10 to-red-600/10' 
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Service Details
                                </span>
                                {modalState.currentPage === 1 && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                                )}
                            </button>
                            <button
                                onClick={() => updateModalState({ currentPage: 2 })}
                                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                                    modalState.currentPage === 2 
                                        ? 'text-red-400 bg-gradient-to-r from-red-500/10 to-red-600/10' 
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment
                                </span>
                                {modalState.currentPage === 2 && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                                )}
                            </button>
                        </div>

                        {/* Enhanced Modal Content */}
                        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                            {/* Enhanced Lottie Animation - Present on both pages */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32">
                                        <DotLottieReact
                                            src="https://lottie.host/cda45751-690f-4e02-8bb4-aa1c373bb08f/UMYxkV6Bal.lottie"
                                            loop
                                            autoplay
                                        />
                                    </div>
                                    {/* Glowing effect around lottie */}
                                    <div className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                                </div>
                            </div>

                            {/* Enhanced Common Info - Present on both pages */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl border border-gray-600/50 backdrop-blur-sm">
                                <div className="flex items-center space-x-3 group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">Type</div>
                                        <div className="text-sm font-semibold text-white">VIP LUXE</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">Delivery</div>
                                        <div className="text-sm font-semibold text-white">{modalState.content.time}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">Price</div>
                                        <div className="text-sm font-semibold text-white">${modalState.content.price}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Page 1: Service Details */}
                            {modalState.currentPage === 1 && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                            Service Description
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {modalState.content.description}
                                        </p>
                                    </div>

                                    {/* Enhanced Cancellation Policy */}
                                    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-6 border border-amber-700/50 backdrop-blur-sm">
                                        <h4 className="font-semibold text-amber-300 mb-4 flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5 text-amber-400" />
                                            Cancellation Policy
                                        </h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {modalState.content.cancellationPolicy}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Page 2: Important Notes & Payment */}
                            {modalState.currentPage === 2 && (
                                <div className="space-y-6">
                                    {/* Enhanced Important Notes */}
                                    <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm">
                                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                            <Star className="h-5 w-5 text-amber-400" />
                                            Important Notes
                                        </h4>
                                        <ul className="text-gray-300 text-sm space-y-3">
                                            <li className="flex items-start gap-3 group">
                                                <span className="group-hover:text-amber-200 transition-colors duration-300">This is a premium service with guaranteed response time</span>
                                            </li>
                                            <li className="flex items-start gap-3 group">
                                                <span className="group-hover:text-amber-200 transition-colors duration-300">All readings are confidential and personalized</span>
                                            </li>
                                            <li className="flex items-start gap-3 group">
                                                <span className="group-hover:text-amber-200 transition-colors duration-300">Please provide accurate information for best results</span>
                                            </li>
                                           
                                        </ul>
                                    </div>

                                    {/* Enhanced Payment Methods */}
                                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm">
                                        <h4 className="font-semibold text-white mb-4 flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-green-400" />
                                            Payment Methods
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => updateModalState({ paymentMethod: 'stripe' })}
                                                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
                                                    modalState.paymentMethod === 'stripe'
                                                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                                                }`}
                                            >
                                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="font-medium text-sm sm:text-base">Stripe Checkout</span>
                                            </button>
                                            
                                            {/* <div className="relative">
                                                <button
                                                    disabled
                                                    className="p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 border-gray-600 bg-gray-700/50 text-gray-300 cursor-not-allowed"
                                                >
                                                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="font-medium text-sm sm:text-base">PayPal Checkout</span>
                                                </button>
                                            </div> */}
                                        </div>

                                    </div>

                                    {/* Enhanced Cancellation Policy - Also on page 2 */}
                                    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-6 border border-amber-700/50 backdrop-blur-sm">
                                        <h4 className="font-semibold text-amber-300 mb-4 flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5 text-amber-400" />
                                            Cancellation Policy
                                        </h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {modalState.content.cancellationPolicy}
                                        </p>
                                    </div>

                                    {/* Error Display */}
                                    {modalState.error && (
                                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-red-300 font-medium text-sm">
                                                        {modalState.error}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Enhanced Modal Footer */}
                        <div className="p-4 sm:p-6 md:p-8 border-t border-gray-800/50 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {modalState.currentPage === 1 ? (
                                    <button
                                        onClick={() => updateModalState({ currentPage: 2 })}
                                        className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold hover:from-red-600 hover:to-red-800 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                    >
                                        Next Page
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={makePayment}
                                        disabled={modalState.isProcessing}
                                        className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold hover:from-red-600 hover:to-red-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {modalState.isProcessing ? (
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
                                )}
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
    );
}

export default ExclusiveTierCards;