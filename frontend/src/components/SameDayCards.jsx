import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";
import { 
    Calendar, 
    Clock, 
    X, 
    CreditCard 
} from "lucide-react";

const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

function SameDayCards() {
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

    const cards = [
        {
            img: "sameday-1.jpg",
            type: "same day reading",
            title: "PRE-RECORDED Reading",
            description: "For those who are in need of immediate guidance and clarity. Allow me to provide you with insight on your next steps. Your order will be delivered within 12-24 hours of purchase. Please note this is a PRE-RECORDED DIGITAL FILE that will be emailed to you.",
            price: "295",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention."
        },
        {
            img: "sameday-2.jpg",
            type: "same day reading",
            title: "LIVE one-on-one Emergency 45-minute reading",
            description: "For those who are in need of immediate guidance and clarity and want to talk virtually face-to-face. This would be either a zoom or Instagram call within 12-24 hours after booking (if you are located in the United States the reading will be scheduled within 12 hours of booking)",
            price: "475",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention."
        }
    ];

    const makePayment = async () => {
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
            console.log(result.error.message);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-extrabold text-white mb-12"
                >
                    Same Day Express
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.filter(price => price.type === "same day reading").map((card, index) => (
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
                                        className="w-40 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Book Now
                                    </button>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
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
                                        className="text-white hover:text-green-400 transition-colors"
                                    >
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-6 h-6 text-green-400" />
                                            <span className="text-gray-300">Reading Type: {modalContent.alt}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-6 h-6 text-blue-400" />
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
                                            <li> Please be present during the consultation, as I do not offer refunds for missed sessions.</li>
                                            <li> After completing the payment, a form will be displayed. Please fill in the required details to complete your booking.</li>
                                            <li> If you do not receive a booking confirmation email after filling out the form, please email us at <span className="text-green-300">soulsticetarot143@gmail.com</span> with a screenshot of your order.</li>
                                            <li> Delivery within 12-24 hours</li>
                                            <li> Bookings made on Fridays will be delivered by the next business day (Tuesday or Wednesday).</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 bg-white/10 p-4 rounded-lg">
                                    <h4 className="text-lg font-bold text-white mb-2">Important Disclaimer</h4>
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
                                        onClick={makePayment}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
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

export default SameDayCards;