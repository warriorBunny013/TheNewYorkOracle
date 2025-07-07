import React, { useState, useCallback, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Heart, Sparkles, Move } from "lucide-react";

function Testimonials({ reviews }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [showDragCursor, setShowDragCursor] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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

    // Handle mouse move for custom drag cursor
    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        if (showDragCursor) {
            document.addEventListener('mousemove', handleMouseMove);
            return () => document.removeEventListener('mousemove', handleMouseMove);
        }
    }, [showDragCursor]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        touchThreshold: 5,
        swipeToSlide: true,
        useCSS: true,
        useTransform: false,
        cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
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

        if (isLongComment) {
            return (
                <p className="leading-relaxed text-sm text-gray-200 mb-4">
                    {`${review.comments.slice(0, MAX_COMMENT_LENGTH)}`}
                    <motion.span 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReadMore(review);
                        }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 text-xs cursor-pointer ml-1 italic font-medium underline decoration-pink-400/50 hover:decoration-pink-300/70"
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
    }, [handleReadMore]);

    return (
        <div className="relative  pt-16 pb-20 px-4 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        {/* <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div> */}
                        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                            What Our Clients Say
                        </h2>
                        {/* <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div> */}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-md max-w-2xl mx-auto">
                        Real experiences from people who've discovered their path through tarot guidance
                    </p>
                </motion.div>

                {/* Testimonials Slider */}
                <div 
                    className="testimonial-slider px-2 sm:px-4"
                    onMouseEnter={() => setShowDragCursor(true)}
                    onMouseLeave={() => setShowDragCursor(false)}
                >
                    <Slider {...settings}>
                        {reviews.map((review, index) => (
                            <motion.div 
                                key={review._id || index} 
                                className="p-2 sm:p-3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <motion.div 
                                    className="relative group cursor-grab active:cursor-grabbing"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleReadMore(review)}
                                >
                                    {/* Card Background with Gradient Border */}
                                    <div className="relative p-1 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm">
                                        <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 h-full border border-white/10 shadow-2xl">
                                            {/* Quote Icon */}
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                <Quote className="w-4 h-4 text-white" />
                                            </div>

                                            {/* Rating Stars */}
                                            <div className="flex items-center gap-1 mb-4">
                                                {Array.from({ length: review.rating }, (_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                    >
                                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                    </motion.div>
                                                ))}
                                                {Array.from({ length: 5 - review.rating }, (_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-gray-600" />
                                                ))}
                                            </div>
                                            
                                            {/* Comment */}
                                            <div className="mb-6">
                                                {renderComments(review)}
                                                {/* Click hint for long comments */}
                                                {review.comments.length > MAX_COMMENT_LENGTH && (
                                                    <div className="mt-3 text-center">
                                                        <motion.div
                                                            className="inline-flex items-center gap-1 text-xs text-pink-400/70 hover:text-pink-300/90 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            {/* <Sparkles className="w-3 h-3" /> */}
                                                            {/* <span>Click to read full review</span> */}
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Client Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {review.clientName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{review.clientName}</p>
                                                        <p className="text-gray-400 text-xs">Verified Client</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Sparkle Effect */}
                                                <motion.div
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    animate={{ rotate: [0, 360] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Sparkles className="w-5 h-5 text-pink-400" />
                                                </motion.div>
                                            </div>

                                            {/* Hover Glow Effect */}
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-pink-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* Custom Drag Cursor */}
            <AnimatePresence>
                {showDragCursor && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="fixed pointer-events-none z-50"
                        style={{
                            left: cursorPosition.x - 32,
                            top: cursorPosition.y - 32,
                        }}
                    >
                        <div className="relative">
                            {/* Cursor Background */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center">
                                <div className="text-center">
                                    <Move className="w-4 h-4 text-white mx-auto mb-1" />
                                    <div className="text-white text-xs font-bold tracking-wider">DRAG</div>
                                </div>
                            </div>
                            
                            {/* Animated Ring */}
                            <motion.div
                                className="absolute inset-0 w-16 h-16 rounded-full border-2 border-pink-400/50"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.8, 0, 0.8],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            
                            {/* Pulse Effect */}
                            <motion.div
                                className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/30"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5,
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Full Comment Popup */}
            <AnimatePresence>
                {isPopupVisible && selectedReview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md"
                        onClick={closePopup}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            className="relative max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-4 max-h-[80vh] sm:max-h-[85vh] md:max-h-[90vh] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Popup Background with Gradient Border */}
                            <div className="relative p-1 sm:p-2 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 backdrop-blur-sm">
                                <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20 shadow-2xl flex flex-col max-h-[calc(80vh-2rem)] sm:max-h-[calc(85vh-2rem)] md:max-h-[calc(90vh-2rem)]">
                                    {/* Close Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg z-10"
                                        onClick={closePopup}
                                    >
                                        ×
                                    </motion.button>
                                    
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between mb-4 sm:mb-6 md:mb-8 mt-8 sm:mt-10">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg">
                                                {selectedReview.clientName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl">{selectedReview.clientName}</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm">Verified Client</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            {Array.from({ length: selectedReview.rating }, (_, i) => (
                                                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
                                            ))}
                                            {Array.from({ length: 5 - selectedReview.rating }, (_, i) => (
                                                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-white text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 md:mb-8 overflow-y-auto custom-scrollbar pr-2 sm:pr-4 max-h-48 sm:max-h-64 md:max-h-80">
                                        <p className="text-gray-200 leading-6 sm:leading-7 md:leading-8">{selectedReview.comments}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                                            <span className="text-xs sm:text-sm text-gray-400">Verified Review</span>
                                        </div>
                                        
                                        {/* Quote Icon */}
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 flex items-center justify-center">
                                            <Quote className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Testimonials;