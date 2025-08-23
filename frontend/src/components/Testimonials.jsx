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

    // Ultra-lightweight slider settings for Safari
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 8000,
        pauseOnHover: false,
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
                        className="text-pink-400 hover:text-pink-300 text-xs cursor-pointer ml-1 italic font-medium underline"
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
        <div className="relative pt-16 pb-20 px-4">
            {/* Minimal background - just a few subtle elements for Safari */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Simple top gradient */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/5 rounded-full"></div>
                
                {/* Simple bottom gradient */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full"></div>
            </div>

            {/* Minimal stars - only 5 for Safari */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Star 1 */}
                <div className="absolute top-20 left-20 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                
                {/* Star 2 */}
                <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                
                {/* Star 3 */}
                <div className="absolute bottom-40 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
                
                {/* Star 4 */}
                <div className="absolute bottom-20 right-20 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                
                {/* Star 5 */}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
            </div>

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Simple Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                        What Our Clients Say
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-md max-w-2xl mx-auto">
                        Real experiences from people who've discovered their path through tarot guidance
                    </p>
                </div>

                {/* Ultra-lightweight Testimonials Slider */}
                <div className="testimonial-slider px-2 sm:px-4">
                    <Slider {...settings}>
                        {reviews.map((review, index) => (
                            <div key={review._id || index} className="p-2 sm:p-3">
                                <div 
                                    className="relative group cursor-pointer"
                                    onClick={() => handleReadMore(review)}
                                >
                                    {/* Simple Card - No heavy effects */}
                                    <div className="relative p-1 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                                        <div className="relative bg-gray-900/90 rounded-2xl p-6 sm:p-8 h-full border border-white/10">
                                            {/* Simple Quote Icon */}
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                                                <Quote className="w-4 h-4 text-white" />
                                            </div>

                                            {/* Simple Rating Stars */}
                                            <div className="flex items-center gap-1 mb-4">
                                                {Array.from({ length: review.rating }, (_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                ))}
                                                {Array.from({ length: 5 - review.rating }, (_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-gray-600" />
                                                ))}
                                            </div>
                                            
                                            {/* Comment */}
                                            <div className="mb-6">
                                                {renderComments(review)}
                                            </div>
                                            
                                            {/* Simple Client Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                                    {review.clientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium text-sm">{review.clientName}</p>
                                                    <p className="text-gray-400 text-xs">Verified Client</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* Simple Popup - No heavy effects */}
            {isPopupVisible && selectedReview && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
                    <div className="relative max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                        {/* Simple Popup Background */}
                        <div className="relative p-1 sm:p-2 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                            <div className="relative bg-gray-900/95 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 flex flex-col max-h-[calc(80vh-2rem)]">
                                {/* Simple Navigation Buttons */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrevious();
                                    }}
                                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center text-white hover:bg-gray-700"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNext();
                                    }}
                                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center text-white hover:bg-gray-700"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                {/* Simple Close Button */}
                                <button
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white border border-gray-600"
                                    onClick={closePopup}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                {/* Simple Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between mb-4 sm:mb-6 mt-8 sm:mt-10 px-8 sm:px-12">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                            {selectedReview.clientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg sm:text-xl">{selectedReview.clientName}</h3>
                                            <p className="text-gray-400 text-xs sm:text-sm">Verified Client</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {Array.from({ length: selectedReview.rating }, (_, i) => (
                                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                        ))}
                                        {Array.from({ length: 5 - selectedReview.rating }, (_, i) => (
                                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        ))}
                                    </div>
                                </div>

                                {/* Simple Content */}
                                <div className="flex-1 text-white text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 overflow-y-auto px-8 sm:px-12 max-h-48 sm:max-h-64">
                                    <p className="text-gray-200 leading-6 sm:leading-7">{selectedReview.comments}</p>
                                </div>

                                {/* Simple Footer */}
                                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/10 px-8 sm:px-12">
                                    <span className="text-xs sm:text-sm text-gray-400">Verified Review</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
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