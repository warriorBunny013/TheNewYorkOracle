import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

    const openModal = (title, description, price,time, cancellationPolicy, alt) => {
        setModalContent({ title, description, price,time, cancellationPolicy, alt });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const bookingLinks = {
        "15 minutes detailed reading": "https://calendly.com/solsticetarot143/15-minutes-detailed-reading",
        "30 minutes detailed reading": "https://calendly.com/solsticetarot143/30-minutes-detailed-reading",
        "45 minutes detailed reading": "https://calendly.com/solsticetarot143/45-minutes-detailed-reading"
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
            img: "Image-2.png",
            type: "career",
            title: "15 minutes detailed reading",
            description: "15 minutes in-depth insight regarding career, finances, and guidance as to how to proceed moving forward.",
            price: "65",
            time:"15 min",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price."
        },
        {
            img: "Image-3.png",
            type: "career",
            title: "30 minutes detailed reading",
            description: "30 minutes in-depth insight regarding career, finances, and guidance as to how to proceed moving forward.",
            price: "125",
            time:"30 min",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price."
        },
        {
            img: "Image-4.png",
            type: "career",
            title: "45 minutes detailed reading",
            description: "45 minutes in-depth insight regarding career, finances, and guidance as to how to proceed moving forward.",
            price: "185",
            time:"45 min",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price."
        }
    ];

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 ">
              <div className="max-w-7xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400"
                >
                  Career Readings
                </motion.h1>
        
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {cards
                    .filter((price) => price.type === "career")
                    .map((card, index) => (
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
                        <div className="relative">
                          <img
                            className="w-full h-64 object-cover filter saturate-75"
                            src={card.img}
                            alt={card.type}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        </div>
        
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-medium text-gray-200">
                              {card.title}
                            </h2>
                          </div>
        
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {card.description}
                          </p>
                          <div className="flex flex-row items-center justify-between pt-2">
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
                              className="w-40 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              Book a Slot
                            </button>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-purple-300">
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
                              <span className="text-gray-300">Reading Type: Career</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-300" />
                              </div>
                              <span className="text-gray-300">
                                Duration: {modalContent.time}
                              </span>
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
                            onClick={() => handleBookingRedirect(modalContent.title)}
                            className="w-40 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500"
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

export default CareerBookingCards;