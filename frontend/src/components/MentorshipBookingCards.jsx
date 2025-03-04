import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";
import { 
    Calendar, 
    Clock, 
    X, 
    CreditCard 
} from "lucide-react";

function MentorshipBookingCards() {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        description: "",
        price: "",
        cancellationPolicy: "",
        alt: ""
    });

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const openModal = (title, description, price, cancellationPolicy, alt) => {
        setModalContent({ title, description, price, cancellationPolicy, alt });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const bookingLinks = {
        "30-minute healing, alignment, and awakening abilities": "https://calendly.com/solsticetarot143/mentorship-program"
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
            img: "Image-5.png",
            type: "mentorship",
            title: "30-minute healing, alignment, and awakening abilities",
            description: "30-minute program dedicated to uncover your hidden spiritual potential. Release blocks, align your energy, and amplify your manifestation powers. Discover the path to inner peace, abundance, and flow. Recommended multiple sessions for optimal results.",
            price: "125",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled session in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your session and will need to purchase another session at full price."
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-extrabold text-white mb-12"
                >
                    Mentorship Program
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.filter(price => price.type === "mentorship").map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: "easeInOut",
                                delay: index * 0.2 
                            }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl transform transition-all hover:scale-105"
                        >
                            <div className="relative bg-white">
                                <img 
                                    className="w-full h-64 object-cover" 
                                    src={card.img} 
                                    alt={card.type} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">{card.title}</h2>
                                </div>
                                
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {card.description}
                                </p>
                                <div className="flex flex-row items-center justify-between">
                                    <button
                                        onClick={() => openModal(card.title, card.description, card.price, card.cancellationPolicy, card.type)}
                                        className="w-40 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        Book a Slot
                                    </button>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                                        ${card.price}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-[#16213e] rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="p-6 bg-white/10 backdrop-blur-lg max-h-screen overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">{modalContent.title}</h2>
                                    <button 
                                        onClick={closeModal} 
                                        className="text-white hover:text-blue-400 transition-colors"
                                    >
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-6 h-6 text-blue-400" />
                                            <span className="text-gray-300">Session Type: {modalContent.alt}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-6 h-6 text-purple-400" />
                                            <span className="text-gray-300">Duration: {modalContent.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-6 h-6 text-blue-400" />
                                            <span className="text-gray-300">Price: ${modalContent.price}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Important Notes</h3>
                                        <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                                            <li>Private, one-on-one LIVE session</li>
                                            <li>No pre-recordings available</li>
                                            <li>Cancellations allowed up to 1 day before</li>
                                            <li>Late arrivals may result in session cancellation</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 bg-white/10 p-4 rounded-lg">
                                    <h4 className="text-lg font-bold text-white mb-2">Cancellation Policy</h4>
                                    <p className="text-sm text-gray-300">{modalContent.cancellationPolicy}</p>
                                </div>

                                <div className="mt-6 flex justify-end space-x-4">
                                    <button 
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => handleBookingRedirect(modalContent.title)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MentorshipBookingCards;