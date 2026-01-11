import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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
    Calendar
} from "lucide-react";

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

function ExclusiveTierForm() {
    const { id } = useParams();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [animationsTriggered, setAnimationsTriggered] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        readingtype: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`${API_URL}/api/booking/${id}`);
                if (response.ok) {
                    setIsAuthorized(true);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [id, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimationsTriggered(true), 100);
        return () => clearTimeout(timer);
    }, []);

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
        try {
            const response = await fetch(`${API_URL}/sendemail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                setResponseMessage("Your details have been sent successfully!");
                setIsCompleted(true);
                setFormData({ name: "", email: "", phone: "", message: "", readingtype: "" });
            } else {
                setResponseMessage("Failed to send your details. Please try again.");
            }
        } catch (error) {
            setResponseMessage("An error occurred. Please try again later.");
        }
        setIsSubmitting(false);
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
                <div className="text-center bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 max-w-md">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-4">Access Restricted</h2>
                    <p className="text-gray-300">Please complete a payment first to access this form.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
                <style jsx>{styles}</style>
                <div className="text-center bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 max-w-md card-glow">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto">
                            <DotLottieReact
                                src="https://lottie.host/cda45751-690f-4e02-8bb4-aa1c373bb08f/UMYxkV6Bal.lottie"
                                loop
                                autoplay
                            />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Verifying your booking...</h2>
                    <p className="text-gray-300">Please wait while we confirm your payment</p>
                </div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 py-12 px-4">
                <style jsx>{styles}</style>
                <div className="max-w-4xl mx-auto">
                    <div className={`text-center animate-fade-up ${animationsTriggered ? 'show' : ''}`}>
                        {/* Success Animation */}
                        <div className="mb-8">
                            <div className="relative mx-auto mb-8">
                                <div className="w-24 h-24 mx-auto">
                                    <DotLottieReact
                                        src="https://lottie.host/cda45751-690f-4e02-8bb4-aa1c373bb08f/UMYxkV6Bal.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>
                                <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-2xl animate-pulse"></div>
                                
                                {/* Floating success elements */}
                                <div className="absolute top-4 right-8 w-3 h-3 bg-green-400 rounded-full animate-pulse float-animation"></div>
                                <div className="absolute bottom-4 left-8 w-2 h-2 bg-emerald-300 rounded-full animate-pulse float-animation-delay-1"></div>
                                <div className="absolute top-1/2 left-2 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse float-animation-delay-2"></div>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                                Booking Complete!
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mt-2">
                                    Welcome to Your Journey
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-green-300 mb-8">Thank you for completing your booking with Marina!</p>
                        </div>
                        
                        {/* Next Steps Card */}
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 max-w-3xl mx-auto mb-8 card-glow">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">What happens next?</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { icon: Mail, text: "Confirmation email with booking details", delay: "100ms" },
                                    { icon: Clock, text: "Marina reviews your info within 24-72 hours", delay: "200ms" },
                                    { icon: Calendar, text: "Live readings: scheduling info via email (within 24-48 hours)", delay: "300ms" },
                                    { icon: Star, text: "Pre-recorded: delivered to your email (within 48-72 hours)", delay: "400ms" }
                                ].map((item, index) => (
                                    <div 
                                        key={index}
                                        className={`flex items-start gap-4 p-4 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl border border-gray-600/30 hover:border-green-500/50 transition-all duration-300 animate-fade-up ${animationsTriggered ? 'show' : ''}`}
                                        style={{ transitionDelay: item.delay }}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Return Button */}
                        <button
                            onClick={() => window.location.href = '/'}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Return to Homepage
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 py-8 px-4 relative overflow-hidden">
            <style jsx>{styles}</style>
            
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full blur-xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className={`mb-8 animate-fade-up ${animationsTriggered ? 'show' : ''}`}>
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl card-glow">
                        <div className="relative p-8 md:p-12">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-xl"></div>
                                <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-lg"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                                {/* Left Content */}
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-500/30 rounded-full">
                                        <Crown className="w-4 h-4 text-red-400" />
                                        <span className="text-red-300 text-sm font-semibold">PREMIUM BOOKING</span>
                                    </div>
                                    
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                                        Complete Your
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
                                            Luxury Experience
                                        </span>
                                    </h1>
                                    
                                    <p className="text-md md:text-lg text-gray-300 leading-relaxed">
                                        You're one step away from your personalized reading. Complete the form below to finalize your 
                                        <span className="text-red-400 font-semibold"> premium booking</span>.
                                    </p>
                                </div>
                                
                                {/* Right Content - Lottie Animation */}
                                <div className="flex justify-center lg:justify-end">
                                    <div className="relative">
                                        <div className="w-48 h-48 md:w-64 md:h-64">
                                            <DotLottieReact
                                                src="https://lottie.host/cda45751-690f-4e02-8bb4-aa1c373bb08f/UMYxkV6Bal.lottie"
                                                loop
                                                autoplay
                                            />
                                        </div>
                                        <div className="absolute inset-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                                        
                                        {/* Floating elements */}
                                        <div className="absolute top-8 right-8 w-3 h-3 bg-red-400 rounded-full animate-pulse float-animation"></div>
                                        <div className="absolute bottom-12 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse float-animation-delay-1"></div>
                                        <div className="absolute top-1/2 left-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse float-animation-delay-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Panel - Information */}
                    <div className={`lg:col-span-2 space-y-6 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '200ms' }}>
                        {/* Important Notice */}
                        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-md rounded-2xl border border-amber-700/50 p-6 card-light">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-amber-300 font-bold text-lg mb-2">Complete Your Booking</h3>
                                    <p className="text-amber-200 text-sm leading-relaxed">This form is required to process your reading. Please fill out all details below.</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Service Features */}
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 card-light">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                What You Get
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Zap, text: "Pre-recorded reading: Delivered within 48-72 hours", gradient: "from-red-500 to-red-700" },
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

                        {/* Contact Info */}
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 card-light">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-3">
                                    info@soulsticetarot.com
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Questions or concerns? Feel free to reach out. Thank you for trusting Marina with your journey!
                                </p>
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
                                <p className="text-gray-300">Provide your information to receive your reading</p>
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
                                                disabled={isCompleted}
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
                                                    disabled={isCompleted}
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
                                                    disabled={isCompleted}
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
                                        <div 
                                            className={`radio-card h-full p-6 border-2 border-gray-600 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-sm ${
                                                formData.readingtype === "Pre-recorded session ($395)" ? 'selected' : ''
                                            }`}
                                            onClick={() => !isCompleted && handleRadioClick("Pre-recorded session ($395)")}
                                        >
                                            <input 
                                                className="hidden" 
                                                type="radio" 
                                                name="readingtype"
                                                value="Pre-recorded session ($395)"
                                                checked={formData.readingtype === "Pre-recorded session ($395)"}
                                                onChange={handleChange}
                                                disabled={isCompleted}
                                                required 
                                            />
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                                    <Zap className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-white font-semibold">Pre-recorded Reading</span>
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-auto ${
                                                    formData.readingtype === "Pre-recorded session ($395)" 
                                                        ? 'border-red-500 bg-red-500' 
                                                        : 'border-gray-400'
                                                }`}>
                                                    {formData.readingtype === "Pre-recorded session ($395)" && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm">Premium session ($395)</p>
                                        </div>

                                        <div 
                                            className={`radio-card h-full p-6 border-2 border-gray-600 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-sm ${
                                                formData.readingtype === "Live 1-hour one-one-one reading ($650)" ? 'selected' : ''
                                            }`}
                                            onClick={() => !isCompleted && handleRadioClick("Live 1-hour one-one-one reading ($650)")}
                                        >
                                            <input 
                                                className="hidden" 
                                                type="radio" 
                                                name="readingtype"
                                                value="Live 1-hour one-one-one reading ($650)"
                                                checked={formData.readingtype === "Live 1-hour one-one-one reading ($650)"}
                                                onChange={handleChange}
                                                disabled={isCompleted}
                                                required 
                                            />
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                                    <Crown className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-white font-semibold">Live Reading</span>
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-auto ${
                                                    formData.readingtype === "Live 1-hour one-one-one reading ($650)" 
                                                        ? 'border-red-500 bg-red-500' 
                                                        : 'border-gray-400'
                                                }`}>
                                                    {formData.readingtype === "Live 1-hour one-one-one reading ($650)" && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm">1-hour one-one-one ($650)</p>
                                        </div>
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
                                                disabled={isCompleted}
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
                                        disabled={isSubmitting || isCompleted}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending Your Details...
                                            </>
                                        ) : isCompleted ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Booking Completed
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Complete Your Booking
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

                {/* Bottom Features Strip */}
                <div className={`mt-12 animate-fade-up ${animationsTriggered ? 'show' : ''}`} style={{ transitionDelay: '600ms' }}>
                    <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { 
                                    icon: Zap, 
                                    title: "Fast Response", 
                                    description: "48-72 hour delivery", 
                                    gradient: "from-red-500 to-red-700" 
                                },
                                { 
                                    icon: Crown, 
                                    title: "Premium Service", 
                                    description: "Exclusive tier experience", 
                                    gradient: "from-purple-500 to-indigo-600" 
                                },
                                { 
                                    icon: Star, 
                                    title: "Personalized", 
                                    description: "Tailored to your needs", 
                                    gradient: "from-amber-500 to-orange-600" 
                                }
                            ].map((feature, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-2 group-hover:text-red-300 transition-colors duration-300">{feature.title}</h4>
                                    <p className="text-gray-400 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExclusiveTierForm;