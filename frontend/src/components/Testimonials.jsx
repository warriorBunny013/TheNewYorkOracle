import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Testimonials({ reviews }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 1000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    return (
        <div className="flex-wrap">
        <div className="mt-10 m-5 lg:m-20 py-5 text-4xl font-bold tracking-tight text-white dark:text-white">Customer testimonials</div>
        <div className="m-5 lg:m-20 lg:text-lg">
            <Slider {...settings}>
                {reviews.map(review => (
                    <div key={review.id} className="p-2 max-w-sm">
                        <div className="flex border rounded-lg h-full dark:bg-gray-800 p-4 flex-col">
                            <div className="flex items-center mb-3">
                                <div className="flex justify justify-between">
                                    <div className="flex p-1 gap-1 text-orange-300">
                                        {Array.from({ length: review.rating }, (_, i) => (
                                            <ion-icon key={i} name="star"></ion-icon>
                                        ))}
                                        {Array.from({ length: 5 - review.rating }, (_, i) => (
                                            <ion-icon key={i} name="star-outline"></ion-icon>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between flex-grow">
                                <p className="leading-relaxed text-base text-white pb-10 dark:text-gray-300">
                                    {review.comments}
                                </p>
                                <div className="flex gap-2">
                                    <div className="w-7 h-7 text-center rounded-full bg-red-500">
                                        {review.clientName.charAt(0)}
                                    </div>
                                    <span>{review.clientName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
        </div>);
}

export default Testimonials;
