import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Testimonials({ reviews }) {
    // State to track expanded comments
    const [expandedComments, setExpandedComments] = useState({});

    // Function to toggle comment expansion
    const toggleCommentExpansion = (id) => {
        setExpandedComments(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

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
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    // Function to render comments with Read More functionality
    const renderComments = (review) => {
        const isLongComment = review.comments.length > MAX_COMMENT_LENGTH;
        const isExpanded = expandedComments[review.id];

        if (isLongComment) {
            return (
                <p className="leading-relaxed text-sm text-gray-200 mb-4">
                    {isExpanded ? review.comments : `${review.comments.slice(0, MAX_COMMENT_LENGTH)}`}
                    <span 
                        onClick={() => toggleCommentExpansion(review.id)}
                        className="text-blue-300 hover:text-blue-200 text-xs cursor-pointer ml-1 italic"
                    >
                        {isExpanded ? '(Show Less)' : '... (Read More)'}
                    </span>
                </p>
            );
        }

        return (
            <p className="leading-relaxed text-sm text-gray-200 mb-4">
                {review.comments}
            </p>
        );
    };

    return (
        <div className="bg-gradient-to-br pt-16 pb-5 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-white mb-12 tracking-tight">
                    Customer Testimonials
                </h2>
                <div className="testimonial-slider">
                    <Slider {...settings}>
                        {reviews.map(review => (
                            <div key={review.id} className="p-4">
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 h-full transition-all duration-300 hover:bg-white/15 hover:scale-105">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex space-x-1 text-yellow-400">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <ion-icon key={i} name="star" class="text-xl"></ion-icon>
                                            ))}
                                            {Array.from({ length: 5 - review.rating }, (_, i) => (
                                                <ion-icon key={i} name="star-outline" class="text-xl text-gray-500"></ion-icon>
                                            ))}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {review.clientName.charAt(0)}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        {renderComments(review)}
                                    </div>
                                    
                                    <div className="flex items-center text-gray-300">
                                        <span className="text-md font-medium">~ {review.clientName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default Testimonials;