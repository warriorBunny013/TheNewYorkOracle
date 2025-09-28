import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from "../utils/apiConfig";
import { 
    User, 
    Mail, 
    Phone, 
    MessageSquare, 
    Crown, 
    Sparkles, 
    Clock, 
    CheckCircle2, 
    Send,
    AlertCircle,
    Zap,
    Star,
    Calendar,
    CreditCard,
    X
} from "lucide-react";

const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

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

    .glass-effect {
        background: rgba(17, 24, 39, 0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
    }

    .input-glow:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.1);
    }

    .gradient-border {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3));
        padding: 1px;
        border-radius: 12px;
    }

    .gradient-border-inner {
        background: rgba(17, 24, 39, 0.8);
        border-radius: 11px;
    }

    .radio-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .radio-card:hover {
        border-color: rgb(239 68 68 / 0.5) !important;
        background: rgb(239 68 68 / 0.1) !important;
    }

    .radio-card.selected {
        border-color: rgb(239 68 68) !important;
        background: rgb(239 68 68 / 0.2) !important;
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
    }
`;

function FormBeforePayment({ 
    isOpen, 
    onClose, 
    productName, 
    price, 
    productType = "premium", // "premium" or "elite"
    description = "",
    cancellationPolicy = ""
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        readingtype: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [animationsTriggered, setAnimationsTriggered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setAnimationsTriggered(true), 100);
            return () => clearTimeout(timer);
        } else {
            setAnimationsTriggered(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    onClose();
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
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        const { id, value, type, name } = e.target;
        if (type === "radio") {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleRadioClick = (value) => {
        setFormData({ ...formData, readingtype: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResponseMessage("");

        try {
            // First, create a temporary booking with form data
            const tempBookingResponse = await fetch(`${API_URL}/api/create-temp-booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    productName,
                    price: parseFloat(price),
                    productType
                }),
            });

            const tempBooking = await tempBookingResponse.json();
            
            if (!tempBooking.success) {
                throw new Error(tempBooking.message || "Failed to create temporary booking");
            }

            // Now create Stripe checkout session with the temp booking ID
            const stripe = await stripePromise;
            const checkoutResponse = await fetch(`${API_URL}/api/create-checkout-session-with-form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName,
                    userPrice: parseFloat(price),
                    tempBookingId: tempBooking.tempBookingId,
                    productType
                }),
            });

            const session = await checkoutResponse.json();
            
            if (session.error) {
                throw new Error(session.error);
            }

            // Redirect to Stripe checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                setResponseMessage(result.error.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setResponseMessage(error.message || "An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getReadingTypeOptions = () => {
        if (productType === "premium") {
            return [
                { value: "Pre-recorded session ($395)", label: "Pre-recorded Reading", price: "$395", icon: Zap },
                { value: "Live 1-hour one-one-one reading ($650)", label: "Live Reading", price: "$650", icon: Crown }
            ];
        } else {
            return [
                { value: "Pre-recorded session ($325)", label: "Pre-recorded Reading", price: "$325", icon: Zap }
            ];
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <style jsx>{styles}</style>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl sm:mx-4 shadow-2xl border border-gray-800/50 max-h-full sm:max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center">
                            <Crown className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                            Complete Your Booking
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left Panel - Information */}
                        <div className={`lg:col-span-2 space-y-6 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '200ms' }}>
                            {/* Service Info */}
                            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 card-light">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Service Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Service:</span>
                                        <p className="text-white font-semibold">{productName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Price:</span>
                                        <p className="text-red-400 font-bold text-lg">${price}</p>
                                    </div>
                                    {description && (
                                        <div>
                                            <span className="text-gray-400 text-sm">Description:</span>
                                            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-md rounded-2xl border border-amber-700/50 p-6 card-light">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-amber-300 font-bold text-lg mb-2">Complete Your Booking</h3>
                                        <p className="text-amber-200 text-sm leading-relaxed">Fill out the form and proceed to payment to secure your reading.</p>
                                    </div>
                                </div>
                            </div>

                            {/* What You Get */}
                            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 card-light">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    What You Get
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Zap, text: "Pre-recorded reading: Delivered within 24-48 hours", gradient: "from-red-500 to-red-700" },
                                        { icon: Crown, text: "LIVE 1 hour one to one reading: Time slot shared via email", gradient: "from-purple-500 to-indigo-600" },
                                        { icon: Clock, text: "First come, first serve within business days", gradient: "from-blue-500 to-cyan-600" },
                                        { icon: Mail, text: "All communication through email", gradient: "from-green-500 to-emerald-600" },
                                        { icon: Star, text: "Form completion essential for processing", gradient: "from-amber-500 to-orange-600" }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 group">
                                            <div className={`w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                <item.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Form */}
                        <div className={`lg:col-span-3 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '400ms' }}>
                            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl card-glow">
                                {/* Form Header */}
                                <div className="mb-8 text-center">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Booking Details</h2>
                                    </div>
                                    <p className="text-gray-300">Provide your information to proceed to payment</p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                                            <User className="w-4 h-4 text-red-400" />
                                            Full Name
                                        </label>
                                        <div className="gradient-border">
                                            <div className="gradient-border-inner">
                                                <input
                                                    className="w-full bg-transparent text-white placeholder-gray-400 p-4 rounded-xl border-0 focus:outline-none input-glow transition-all duration-300"
                                                    placeholder="Enter your full name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    type="text"
                                                    id="name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email and Phone Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                                                <Mail className="w-4 h-4 text-red-400" />
                                                Email Address
                                            </label>
                                            <div className="gradient-border">
                                                <div className="gradient-border-inner">
                                                    <input
                                                        className="w-full bg-transparent text-white placeholder-gray-400 p-4 rounded-xl border-0 focus:outline-none input-glow transition-all duration-300"
                                                        placeholder="your.email@example.com"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        type="email"
                                                        id="email"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                                                <Phone className="w-4 h-4 text-red-400" />
                                                Phone Number
                                                <span className="text-gray-500 text-xs">(Optional)</span>
                                            </label>
                                            <div className="gradient-border">
                                                <div className="gradient-border-inner">
                                                    <input
                                                        className="w-full bg-transparent text-white placeholder-gray-400 p-4 rounded-xl border-0 focus:outline-none input-glow transition-all duration-300"
                                                        placeholder="+1 (555) 123-4567"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        type="tel"
                                                        id="phone"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reading Type Selection */}
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                                            <Crown className="w-4 h-4 text-red-400" />
                                            Select Your Reading Type
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getReadingTypeOptions().map((option, index) => (
                                                <div 
                                                    key={index}
                                                    className={`radio-card h-full p-6 border-2 border-gray-600 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-sm ${
                                                        formData.readingtype === option.value ? 'selected' : ''
                                                    }`}
                                                    onClick={() => handleRadioClick(option.value)}
                                                >
                                                    <input 
                                                        className="hidden" 
                                                        type="radio" 
                                                        name="readingtype"
                                                        value={option.value}
                                                        checked={formData.readingtype === option.value}
                                                        onChange={handleChange}
                                                        required 
                                                    />
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                                            <option.icon className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="text-white font-semibold">{option.label}</span>
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-auto ${
                                                            formData.readingtype === option.value 
                                                                ? 'border-red-500 bg-red-500' 
                                                                : 'border-gray-400'
                                                        }`}>
                                                            {formData.readingtype === option.value && (
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{option.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                                            <MessageSquare className="w-4 h-4 text-red-400" />
                                            Your Questions & Details
                                        </label>
                                        <div className="gradient-border">
                                            <div className="gradient-border-inner">
                                                <textarea
                                                    className="w-full bg-transparent text-white placeholder-gray-400 p-4 rounded-xl border-0 focus:outline-none input-glow transition-all duration-300 resize-none"
                                                    placeholder="Please include any pertinent details and questions you'd like to ask. The more specific you are, the more personalized your reading will be..."
                                                    rows="6"
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-5 h-5" />
                                                    Proceed to Payment
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Response Message */}
                                    {responseMessage && (
                                        <div className={`mt-6 p-4 rounded-xl border backdrop-blur-sm ${
                                            responseMessage.includes('successfully') 
                                                ? 'bg-green-900/30 border-green-500/30' 
                                                : 'bg-red-900/30 border-red-500/30'
                                        }`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    responseMessage.includes('successfully') 
                                                        ? 'bg-green-500' 
                                                        : 'bg-red-500'
                                                }`}>
                                                    {responseMessage.includes('successfully') ? (
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <AlertCircle className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <p className={`font-medium text-sm ${
                                                    responseMessage.includes('successfully') 
                                                        ? 'text-green-300' 
                                                        : 'text-red-300'
                                                }`}>
                                                    {responseMessage}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormBeforePayment;
