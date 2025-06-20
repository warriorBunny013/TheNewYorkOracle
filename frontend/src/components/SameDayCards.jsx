import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";
import { 
    Calendar, 
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
        type:"",
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

    const openModal = (title, description, price,type, cancellationPolicy, alt, extrainfo) => {
        setModalContent({ title, description, price,type, cancellationPolicy, alt, extrainfo });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const cards = [
        {
            img: "sameday-1.jpg",
            type: "Express reading",
            title: "PRE-RECORDED Reading",
            description: "For those who are in need of immediate guidance and clarity. Allow me to provide you with insight on your next steps. Your order will be delivered within 24-72 hours of purchase. Please note this is a PRE-RECORDED DIGITAL FILE that will be emailed to you.",
            price: "295",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention.",
            extrainfo:"Delivery within 24-72 hours"
        },
        {
            img: "sameday-2.jpg",
            type: "Express reading",
            title: "LIVE one-on-one Emergency 45-minute reading",
            description: "For those who are in need of immediate guidance and clarity and want to talk virtually face-to-face.This will be either a Zoom or Instagram call, scheduled on a first come, first serve basis within the next few business days (Delivery within 24-72 hours)",
            price: "475",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention.",
            extrainfo:"Delivery within 24-72 hours. Reading is a first come, first serve within the next few business days"
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
                    Express Reading
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.filter(price => price.type === "Express reading").map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: "easeInOut",
                                delay: index * 0.2 
                            }}
                            className="bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-1"
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
                                        onClick={() => openModal(card.title, card.description, card.price,card.type, card.cancellationPolicy,card.type,card.extrainfo)}
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
                                <div className="fixed inset-0 z-50 flex items-center justify-center">
                                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="relative bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl border border-gray-800"
                                  >
                                    <div className="p-8 max-h-[90vh] overflow-y-auto">
                                      <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-medium text-gray-200">
                                          {modalContent.title}
                                        </h2>
                                        <button
                                          onClick={closeModal}
                                          className="text-gray-400 hover:text-gray-200 transition-colors"
                                        >
                                          <X className="w-6 h-6" />
                                        </button>
                                      </div>
                      
                                      <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                          <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                              <Calendar className="w-5 h-5 text-rose-300" />
                                            </div>
                                            <span className="text-gray-300">Reading Type: {modalContent.type}</span>
                                          </div>
                                          
                                          <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                              <CreditCard className="w-5 h-5 text-blue-300" />
                                            </div>
                                            <span className="text-gray-300">
                                              Price: ${modalContent.price}
                                            </span>
                                          </div>
                                        </div>
                      
                                        <div className="space-y-4">
                                          <h3 className="text-lg font-medium text-gray-200">
                                            Important Notes
                                          </h3>
                                          <ul className="text-sm text-gray-400 space-y-3">
                                            {[
                                              "Private, one-on-one LIVE reading session",
                                              "No pre-recordings available",
                                              "Cancellations allowed up to 1 day before",
                                              "Late arrivals may result in session cancellation"
                                            ].map((item, i) => (
                                              <li key={i} className="flex items-start space-x-2">
                                                <div className="w-1 h-1 rounded-full bg-gray-500 mt-2"></div>
                                                <span>{item}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                      
                                      <div className="mt-8 bg-gray-800/40 backdrop-blur-md p-5 rounded-xl border border-gray-700/30">
                                        <h4 className="text-lg font-medium text-gray-200 mb-3">
                                          Cancellation Policy
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                          {modalContent.cancellationPolicy}
                                        </p>
                                      </div>
                      
                                      <div className="mt-8 flex justify-end space-x-4">
                                        <button
                                          onClick={closeModal}
                                          className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                          Close
                                        </button>
                                        <button
                                          onClick={makePayment}
                                          className="w-40 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
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