import React, { useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";

function Testimonials({ reviews }) {
    // State to track expanded comments
    const [expandedComments, setExpandedComments] = useState({});
    const [selectedReview, setSelectedReview] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Function to toggle comment expansion
    const toggleCommentExpansion = useCallback((id) => {
        setExpandedComments(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    const handleReadMore = useCallback((review) => {
        setSelectedReview(review);
        setIsPopupVisible(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsPopupVisible(false);
        setSelectedReview(null);
    }, []);

    // Max comment length before "Read more" appears
    const MAX_COMMENT_LENGTH = 150;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        touchThreshold: 5,
        swipeToSlide: true,
        useCSS: true,
        useTransform: true,
        cssEase: "ease-out",
        pauseOnHover: true,
        pauseOnFocus: true,
        touchMove: true,
        draggable: true,
        swipe: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: false,
                    touchThreshold: 5,
                    swipeToSlide: true,
                    touchMove: true,
                    draggable: true,
                    swipe: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: false,
                    touchThreshold: 5,
                    swipeToSlide: true,
                    touchMove: true,
                    draggable: true,
                    swipe: true
                }
            }
        ]
    };

    // Function to render comments with Read More functionality
    const renderComments = useCallback((review) => {
        const isLongComment = review.comments.length > MAX_COMMENT_LENGTH;
        const isExpanded = expandedComments[review.id];

        if (isLongComment) {
            return (
                <p className="leading-relaxed text-sm text-gray-200 mb-4">
                    {isExpanded ? review.comments : `${review.comments.slice(0, MAX_COMMENT_LENGTH)}`}
                    <motion.span 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReadMore(review)}
                        className="text-blue-300 hover:text-blue-200 text-xs cursor-pointer ml-1 italic"
                    >
                        ... (Read More)
                    </motion.span>
                </p>
            );
        }

        return (
            <p className="leading-relaxed text-sm text-gray-200 mb-4">
                {review.comments}
            </p>
        );
    }, [expandedComments, handleReadMore]);

    return (
        <div className="bg-gradient-to-br pt-16 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-white mb-12 tracking-tight">
                    Customer Testimonials
                </h2>
                <div className="testimonial-slider px-4">
                    <Slider {...settings}>
                        {reviews.map(review => (
                            <motion.div 
                                key={review.id} 
                                className="p-2"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 h-full transition-all duration-300 hover:bg-white/15">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex space-x-1 text-yellow-400">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <ion-icon key={i} name="star" className="text-xl"></ion-icon>
                                            ))}
                                            {Array.from({ length: 5 - review.rating }, (_, i) => (
                                                <ion-icon key={i} name="star-outline" className="text-xl text-gray-500"></ion-icon>
                                            ))}
                                        </div>
                                        <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                                        >
                                            {review.clientName.charAt(0)}
                                        </motion.div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        {renderComments(review)}
                                    </div>
                                    
                                    <div className="flex items-center text-gray-300">
                                        <span className="text-md font-medium">~ {review.clientName}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* Full Comment Popup */}
            <AnimatePresence>
                {isPopupVisible && selectedReview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-sm"
                        onClick={closePopup}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 transition-colors z-10"
                                onClick={closePopup}
                            >
                                &times;
                            </motion.button>
                            
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex space-x-1 text-yellow-400">
                                    {Array.from({ length: selectedReview.rating }, (_, i) => (
                                        <ion-icon key={i} name="star" className="text-2xl"></ion-icon>
                                    ))}
                                    {Array.from({ length: 5 - selectedReview.rating }, (_, i) => (
                                        <ion-icon key={i} name="star-outline" className="text-2xl text-gray-500"></ion-icon>
                                    ))}
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {selectedReview.clientName.charAt(0)}
                                </div>
                            </div>

                            <div className="text-white text-lg leading-relaxed mb-6 overflow-y-auto flex-grow custom-scrollbar">
                                {selectedReview.comments}
                            </div>

                            <div className="flex items-center justify-end text-gray-300 mt-4">
                                <span className="text-lg font-medium">~ {selectedReview.clientName}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Testimonials;