import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { 
    CheckCircle2, 
    Mail, 
    Clock, 
    Calendar, 
    Star,
    Sparkles,
    Home
} from "lucide-react";

const styles = `
    .card-glow {
        box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1);
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
        background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
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
`;

function BookingSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [bookingData, setBookingData] = useState(null);
    const [animationsTriggered, setAnimationsTriggered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimationsTriggered(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Simulate loading and fetch booking data
        const fetchBookingData = async () => {
            try {
                // In a real implementation, you might want to fetch booking details
                // For now, we'll just simulate success
                setTimeout(() => {
                    setBookingData({
                        bookingId: id,
                        productName: "Premium Reading",
                        status: "completed"
                    });
                    setIsLoading(false);
                }, 2000);
            } catch (error) {
                console.error("Error fetching booking data:", error);
                setIsLoading(false);
            }
        };

        fetchBookingData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900">
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
                        <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Processing your booking...</h2>
                    <p className="text-green-200 text-sm sm:text-base">Please wait while we finalize your order</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 py-12 px-4">
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
                            Payment Successful!
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mt-2">
                                Booking Complete
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-green-300 mb-8">Thank you for your payment! Your booking has been confirmed.</p>
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
                                { icon: Clock, text: "Marina reviews your info within 24-48 hours", delay: "200ms" },
                                { icon: Calendar, text: "Live readings: scheduling info via email", delay: "300ms" },
                                { icon: Star, text: "Pre-recorded: delivered to your email", delay: "400ms" }
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
                    
                    {/* Contact Info */}
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 mb-8 card-light">
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-3">
                                info@soulsticetarot.com
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Questions or concerns? Feel free to reach out. Thank you for trusting Marina with your journey!
                            </p>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5" />
                            Return to Homepage
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Sparkles className="w-5 h-5" />
                            Print Confirmation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingSuccess;
