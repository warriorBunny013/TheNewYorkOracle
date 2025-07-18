import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
            time:"30 min",
            description: "30-minute program dedicated to uncover your hidden spiritual potential. Release blocks, align your energy, and amplify your manifestation powers. Discover the path to inner peace, abundance, and flow. Recommended multiple sessions for optimal results.",
            price: "125",
            cancellationPolicy: "Cancellations must be done at least 24 hours before your scheduled session in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your session and will need to purchase another session at full price."
        }
    ];

    // Animation variants for smooth scroll animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.95,
            filter: "blur(10px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const titleVariants = {
        hidden: { 
            opacity: 0, 
            y: -30,
            filter: "blur(5px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 md:mb-8 lg:mb-12 text-center md:text-left"
                >
                    Mentorship Program
                </motion.h1>

                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {cards.filter(price => price.type === "mentorship").map((card, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ 
                                y: -8,
                                scale: 1.02,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className="bg-gray-900/40 backdrop-blur-md rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="relative bg-white overflow-hidden">
                                <motion.img 
                                    className="w-full h-48 sm:h-56 md:h-64 object-cover" 
                                    src={card.img} 
                                    alt={card.type} 
                                    whileHover={{ 
                                        scale: 1.05,
                                        transition: { duration: 0.4, ease: "easeOut" }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            </div>
                            
                            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">{card.title}</h2>
                                </div>
                                
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {card.description}
                                </p>
                                <div className="flex flex-row items-center pt-5 justify-between gap-3 sm:gap-0">
                                    <motion.button
                                        onClick={() => openModal(card.title, card.description, card.price,card.time,card.cancellationPolicy, card.type)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-[7.5rem] sm:w-40 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                                    >
                                        Book a Slot
                                    </motion.button>
                                    <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                                        ${card.price}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

               
                       {showModal && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
                           <motion.div
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ duration: 0.3, ease: "easeInOut" }}
                             className="relative bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-xl md:rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-gray-800 max-h-[90vh] flex flex-col"
                           >
                             <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                               <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                                 <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200">
                                   {modalContent.title}
                                 </h2>
                                 <button
                                   onClick={closeModal}
                                   className="text-gray-400 hover:text-gray-200 transition-colors"
                                 >
                                   <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                 </button>
                               </div>
               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                 <div className="space-y-3 sm:space-y-4 md:space-y-5">
                                   <div className="flex items-center space-x-3 sm:space-x-4">
                                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                       <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />
                                     </div>
                                     <span className="text-sm sm:text-base text-gray-300">Reading Type: Mentorship</span>
                                   </div>
                                   <div className="flex items-center space-x-3 sm:space-x-4">
                                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                       <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                                     </div>
                                     <span className="text-sm sm:text-base text-gray-300">
                                       Duration: {modalContent.time}
                                     </span>
                                   </div>
                                   <div className="flex items-center space-x-3 sm:space-x-4">
                                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
                                       <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                                     </div>
                                     <span className="text-sm sm:text-base text-gray-300">
                                       Price: ${modalContent.price}
                                     </span>
                                   </div>
                                 </div>
               
                                 <div className="space-y-3 sm:space-y-4">
                                   <h3 className="text-base sm:text-lg font-medium text-gray-200">
                                     Important Notes
                                   </h3>
                                   <ul className="text-sm text-gray-400 space-y-2 sm:space-y-3">
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
               
                               <div className="mt-6 sm:mt-8 bg-gray-800/40 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-gray-700/30">
                                 <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-3">
                                   Cancellation Policy
                                 </h4>
                                 <p className="text-sm text-gray-400 leading-relaxed">
                                   {modalContent.cancellationPolicy}
                                 </p>
                               </div>
               
                               <div className="mt-6 sm:mt-8 flex flex-row justify-end space-x-4">
                                 <button
                                   onClick={() => handleBookingRedirect(modalContent.title)}
                                   className="w-full sm:w-40 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                                 >
                                   Book Now
                                 </button>
                                 <button
                                   onClick={closeModal}
                                   className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                                 >
                                   Close
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