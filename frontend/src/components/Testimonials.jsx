import React, { useState, useCallback, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

function Testimonials({ reviews }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleReadMore = useCallback((review) => {
        setSelectedReview(review);
        setIsPopupVisible(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsPopupVisible(false);
        setSelectedReview(null);
    }, []);

    // Navigation functions for popup
    const goToPrevious = useCallback(() => {
        if (!selectedReview) return;
        const currentIndex = reviews.findIndex(review => review._id === selectedReview._id);
        const previousIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
        setSelectedReview(reviews[previousIndex]);
    }, [selectedReview, reviews]);

    const goToNext = useCallback(() => {
        if (!selectedReview) return;
        const currentIndex = reviews.findIndex(review => review._id === selectedReview._id);
        const nextIndex = currentIndex === reviews.length - 1 ? 0 : currentIndex + 1;
        setSelectedReview(reviews[nextIndex]);
    }, [selectedReview, reviews]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPopupVisible) return;
            
            if (e.key === 'Escape') {
                closePopup();
            } else if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isPopupVisible, closePopup, goToPrevious, goToNext]);

    // Max comment length before "Read more" appears
    const MAX_COMMENT_LENGTH = 150;

    // Lightweight slider settings - no heavy animations
    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
        swipe: true,
        touchMove: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
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
                    <span 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReadMore(review);
                        }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 text-xs cursor-pointer ml-1 italic font-medium underline decoration-pink-400/50 hover:decoration-pink-300/70"
                    >
                        ... (Read More)
                    </span>
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
        <div className="relative pt-16 pb-20 px-4 overflow-hidden">
            {/* Magical Background Gradients - Lightweight for Safari */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top right gradient orb */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-blue-500/15 rounded-full blur-3xl"></div>
                
                {/* Bottom left gradient orb */}
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/15 via-purple-500/10 to-pink-500/15 rounded-full blur-3xl"></div>
                
                {/* Center gradient orb */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/8 via-purple-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
            </div>

            {/* Magical Sprinkled Stars - Lightweight CSS animations */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Star 1 */}
                <div className="absolute top-20 left-20 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-pulse shadow-[0_0_4px_1px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                
                {/* Star 2 */}
                <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full opacity-90 animate-pulse shadow-[0_0_6px_2px_rgba(255,255,255,0.9)]" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                
                {/* Star 3 */}
                <div className="absolute bottom-40 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-70 animate-pulse shadow-[0_0_3px_1px_rgba(255,255,255,0.7)]" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
                
                {/* Star 4 */}
                <div className="absolute bottom-20 right-20 w-0.5 h-0.5 bg-white rounded-full opacity-85 animate-pulse shadow-[0_0_5px_2px_rgba(255,255,255,0.85)]" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
                
                {/* Star 5 */}
                <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-75 animate-pulse shadow-[0_0_4px_1px_rgba(255,255,255,0.75)]" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
                
                {/* Star 6 */}
                <div className="absolute top-2/3 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-pulse shadow-[0_0_5px_2px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0.8s', animationDuration: '4.5s' }}></div>
                
                {/* Additional smaller stars for more magic */}
                {/* Star 7 */}
                <div className="absolute top-16 right-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-pulse shadow-[0_0_2px_1px_rgba(255,255,255,0.6)]" style={{ animationDelay: '1.2s', animationDuration: '3.8s' }}></div>
                
                {/* Star 8 */}
                <div className="absolute bottom-32 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-65 animate-pulse shadow-[0_0_3px_1px_rgba(255,255,255,0.65)]" style={{ animationDelay: '2.3s', animationDuration: '4.2s' }}></div>
                
                {/* Star 9 */}
                <div className="absolute top-3/4 right-16 w-0.5 h-0.5 bg-white rounded-full opacity-55 animate-pulse shadow-[0_0_2px_1px_rgba(255,255,255,0.55)]" style={{ animationDelay: '0.3s', animationDuration: '3.2s' }}></div>
                
                {/* Star 10 */}
                <div className="absolute top-1/4 left-16 w-0.5 h-0.5 bg-white rounded-full opacity-70 animate-pulse shadow-[0_0_4px_1px_rgba(255,255,255,0.7)]" style={{ animationDelay: '1.8s', animationDuration: '3.6s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Enhanced Header Section with Beautiful Gradients */}
                <div className="text-center mb-16">
                    <div className="relative">
                        {/* Header background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full transform scale-150"></div>
                        
                        <h2 className="relative text-3xl sm:text-5xl font-bold bg-gradient-to-r from-white via-pink-100 via-purple-100 to-blue-100 bg-clip-text text-transparent mb-6">
                            What Our Clients Say
                        </h2>
                        
                        <p className="relative text-gray-300 text-sm sm:text-md max-w-2xl mx-auto">
                            Real experiences from people who've discovered their path through tarot guidance
                        </p>
                    </div>
                </div>

                {/* Enhanced Testimonials Slider with Beautiful Gradients */}
                <div className="testimonial-slider px-2 sm:px-4">
                    <Slider {...settings}>
                        {reviews.map((review, index) => (
                            <div key={review._id || index} className="p-2 sm:p-3">
                                <div 
                                    className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                                    onClick={() => handleReadMore(review)}
                                >
                                    {/* Enhanced Card with Beautiful Gradients */}
                                    <div className="relative p-1 rounded-2xl bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 shadow-lg">
                                        {/* Card glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl p-6 sm:p-8 h-full border border-white/10 shadow-xl backdrop-blur-sm">
                                            {/* Enhanced Quote Icon with Glow */}
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-sm opacity-60"></div>
                                                <Quote className="w-4 h-4 text-white relative z-10" />
                                            </div>

                                            {/* Enhanced Rating Stars with Subtle Glow */}
                                            <div className="flex items-center gap-1 mb-4">
                                                {Array.from({ length: review.rating }, (_, i) => (
                                                    <div key={i} className="relative">
                                                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-30"></div>
                                                        <Star className="w-5 h-5 text-yellow-400 fill-current relative z-10" />
                                                    </div>
                                                ))}
                                                {Array.from({ length: 5 - review.rating }, (_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-gray-600" />
                                                ))}
                                            </div>
                                            
                                            {/* Comment */}
                                            <div className="mb-6">
                                                {renderComments(review)}
                                            </div>
                                            
                                            {/* Enhanced Client Info with Gradients */}
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-sm opacity-40"></div>
                                                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {review.clientName.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium text-sm">{review.clientName}</p>
                                                    <p className="text-gray-400 text-xs">Verified Client</p>
                                                </div>
                                            </div>
                                            
                                            {/* Enhanced Hover Glow Effect */}
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-pink-500/15 group-hover:via-purple-500/15 group-hover:to-blue-500/15 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* Enhanced Popup with Beautiful Gradients */}
            {isPopupVisible && selectedReview && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
                    <div className="relative max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                        {/* Enhanced Popup Background with Beautiful Gradients */}
                        <div className="relative p-1 sm:p-2 rounded-2xl bg-gradient-to-br from-pink-500/40 via-purple-500/40 to-blue-500/40 shadow-2xl">
                            {/* Popup glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-2xl"></div>
                            
                            <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl flex flex-col max-h-[calc(80vh-2rem)] backdrop-blur-sm">
                                {/* Enhanced Navigation Buttons with Gradients */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrevious();
                                    }}
                                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-gray-800/90 hover:to-gray-700/90 transition-all duration-300 shadow-lg"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNext();
                                    }}
                                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-gray-800/90 hover:to-gray-700/90 transition-all duration-300 shadow-lg"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                {/* Enhanced Close Button with Gradients */}
                                <button
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 flex items-center justify-center text-gray-300 hover:text-white border border-gray-600 transition-all duration-300 shadow-lg"
                                    onClick={closePopup}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                {/* Enhanced Header with Gradients */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between mb-4 sm:mb-6 mt-8 sm:mt-10 px-8 sm:px-12">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-sm opacity-40"></div>
                                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                                                {selectedReview.clientName.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg sm:text-xl">{selectedReview.clientName}</h3>
                                            <p className="text-gray-400 text-xs sm:text-sm">Verified Client</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {Array.from({ length: selectedReview.rating }, (_, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-30"></div>
                                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current relative z-10" />
                                            </div>
                                        ))}
                                        {Array.from({ length: 5 - selectedReview.rating }, (_, i) => (
                                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        ))}
                                    </div>
                                </div>

                                {/* Enhanced Content */}
                                <div className="flex-1 text-white text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 overflow-y-auto px-8 sm:px-12 max-h-48 sm:max-h-64">
                                    <p className="text-gray-200 leading-6 sm:leading-7">{selectedReview.comments}</p>
                                </div>

                                {/* Enhanced Footer with Gradients */}
                                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/10 px-8 sm:px-12">
                                    <span className="text-xs sm:text-sm text-gray-400">Verified Review</span>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-sm opacity-40"></div>
                                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center">
                                            <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Testimonials;