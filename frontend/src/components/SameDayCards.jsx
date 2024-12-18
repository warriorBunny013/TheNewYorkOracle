import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";

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
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [message, setMessage] = useState("");

    useEffect(() => {
        if (showModal) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [showModal]);

    const openModal = (title, description, price, cancellationPolicy, alt) => {
        setModalContent({ title, description, price, cancellationPolicy, alt });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    const [prices, setPrices] = useState([]);
    useEffect(() => {
        // Fetch prices from the backend API
        const fetchPrices = async () => {
            try {
                const response = await fetch(`${API_URL}/api/prices`);
                const data = await response.json();
                setPrices(data);
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        };

        fetchPrices();
    }, []);

    // const bookingLinks = {
    //     "30-minute healing, alignment, and awakening abilities": "https://calendly.com/solsticetarot143/mentorship-program"
    // };

    // const handleBookingRedirect = (duration) => {
    //     const bookingUrl = bookingLinks[duration];
    //     if (bookingUrl) {
    //         window.location.href = bookingUrl; // Opens in the same tab
    //     } else {
    //         alert("Booking link not available for this duration.");
    //     }
    // };
    const cards = [
        {
            img: "sameday-1.jpg",
            type: "same day reading",
            title: "PRE-RECORDED Reading",
            description: "For those who are in need of immediate guidance and clarity. Allow me to provide you with insight on your next steps. Your order will be delivered within 12-24 hours of purchase. Please note this is a PRE-RECORDED DIGITAL FILE that will be emailed to you.",
            price: "295",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention."
        },{
            img: "sameday-2.jpg",
            type: "same day reading",
            title: "LIVE one-on-one Emergency 45-minute reading",
            description: "For those who are in need of immediate guidance and clarity and want to talk virtually face-to-face. This would be either a zoom or Instagram call within 12-24 hours after booking (if you are located in the United States the reading will be scheduled within 12 hours of booking) ",
            price: "475",
            cancellationPolicy: "By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention."
        }
    ];

    const makePayment = async () => {

        const stripe = await stripePromise;

        const body = {
            // products: [{
            //     title: modalContent.title,
            //     price: modalContent.price,
            // }],
            // userName: name,
            // userEmail: email,
            // userMessage: message,
            productName:modalContent.title,
            userPrice:modalContent.price
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

    // const isFormValid = name && email && message;

    return (
        <div className="flex-wrap">
            <div className="mt-20 m-5 lg:ml-20 text-4xl font-bold tracking-tight text-white  dark:text-white">Same Day Express</div>
            <motion.div
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }} 
             className="max-w-screen-xl mx-auto p-5 sm:p-10 overflow-hidden md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
                    {cards.filter(price => price.type === "same day reading").map((card, index) => (
                        <div key={index} className="rounded overflow-hidden shadow-lg bg-white flex flex-col">
                            <div className="relative">
                                <img className="object-cover w-[40rem] h-[18rem]" src={card.img} alt={card.type} />
                                <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                            </div>
                            <div className="px-6 py-4 mb-auto">
                                <div className="text-lg text-[1.3rem] font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition duration-500 ease-in-out inline-block mb-2">{card.title}</div>
                                <p className="text-gray-700 [word-spacing:2px] text-md">{card.description}</p>
                            </div>
                            <div className="px-6 py-3 flex flex-row items-center justify-between">
                                <button 
                                    className="btn ml-1 rounded-sm btn-active btn-primary text-white"
                                    onClick={() => openModal(card.title, card.description, card.price, "Cancellations must be done at least 24 hours before your scheduled reading in order to avoid a rescheduling fee. Any last-minute cancellations and requests for rescheduling will result in a $75 rescheduling fee. Any no-show appointments result in a loss of your reading and will need to purchase another reading at full price.", card.type)}
                                >
                                    Book Now
                                </button>
                                <span className="ml-1 text-black font-bold text-xl">${card.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {showModal && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        <div className="relative w-full h-full max-w-lg md:max-w-5xl mx-auto my-6">
                            <div className="relative flex flex-col w-full bg-gray-800 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-gray-800">
                                <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200 rounded-t dark:bg-gray-700">
                                    <div className="flex items-center flex-wrap lg:space-x-4">
                                        <div className="flex m-2 items-center">
                                            <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white bg-blue-500 rounded-full">1</span>
                                            <span className=" text-white">──</span>
                                            <span className="px-2 py-1 text-sm font-semibold text-white">Payment</span>
                                        </div>
                                        <div className="flex m-2 items-center">
                                            <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white bg-gray-500 rounded-full">2</span>
                                            <span className=" text-white">──</span>
                                            <span className="px-2 py-1 text-sm font-semibold text-gray-500">Fill Details</span>
                                        </div>
                                        <div className="flex m-2 items-center">
                                            <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white bg-gray-500 rounded-full">3</span>
                                            <span className=" text-white">──</span>
                                            <span className="px-2 py-1 text-sm font-semibold text-gray-500">Complete</span>
                                        </div>
                                    </div>
                                    <button
                                        className="ml-auto text-2xl font-semibold bg-transparent border-0 outline-none focus:outline-none"
                                        onClick={closeModal}
                                    >
                                        <span className="block text-3xl text-white bg-transparent outline-none focus:outline-none">×</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <h3 className="text-2xl font-semibold text-white dark:text-white">Order Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-400 dark:text-gray-400">Selected Reading:</span>
                                                <span className="text-sm lg:text-xl font-bold text-gray-400 dark:text-gray-300">{modalContent.title}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-400 dark:text-gray-400">Type:</span>
                                                <span className="text-sm font-semibold text-gray-300 dark:text-gray-300 capitalize">{modalContent.alt}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-400 dark:text-gray-400">Price:</span>
                                                <span className="text-sm font-semibold text-gray-300 dark:text-gray-300">${modalContent.price}</span>
                                            </div>
                                            <div className="mt-6">
                                                <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-400">Description:</h4>
                                                <p className="mt-2 text-sm text-gray-300 dark:text-gray-300">{modalContent.description}</p>
                                            </div>
                                          
                                        </div>
                                        <div className="space-y-4">
                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400" htmlFor="fullname">Full Name</label>
                                                <input 
                                                 className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                 id="fullname" 
                                                 type="text" 
                                                 value={name}
                                                 onChange={(e) => setName(e.target.value)}
                                                 required
                                                />
                                            </div> */}
                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400" htmlFor="email">Email Address</label>
                                                <input 
                                                className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="email" 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                />
                                            </div> */}
                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="message">Any details u want me to know?</label>
                                                <textarea
                                               className="w-full p-2 h-[5rem] mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                               id="message" 
                                               type="text" 
                                               value={message}
                                               onChange={(e) => setMessage(e.target.value)}
                                               required
                                                />
                                            </div> */}
                                            {/* <p className="text-xs text-gray-400 dark:text-gray-400">Don't worry, your booking information is safe with us.</p> */}
                                            <ul className="list mt-4 space-y-2 list-inside text-white text-sm">
                                             {/* <li>👉 Please note this is a private, one-on-one LIVE reading session, there are no pre-recordings available at this moment.</li> */}
                                             <li>👉 Please be present during the consultation, as I do not offer refunds for missed sessions.</li>
    {/* <li>👉 Please include any pertinent details and any questions you would like to ask.</li> */}
    <li>👉 Please note: Readings will not be accepted if you are more than 10 minutes late.</li>
    <li>👉  After completing the payment, a form will be displayed. Please fill in the required details to complete your booking.</li>
    <li>👉 If you do not receive a booking confirmation email after filling out the form, please email us at <a href="mailto:soulsticetarot143@gmail.com" style={{color: "#4CAF50", textDecoration: "none"}}>soulsticetarot143@gmail.com</a> with a screenshot of your order.</li>

                                             {/* <li>👉 Please note that cancellations and rescheduling are allowed up to 1 day before the meeting.</li> */}
                                       {/* <li>If you miss your session, you cannot get a refund.</li> */}
                                     </ul>
                                     {/* <div className="space-y-2 list-inside text-gray-300 text-sm">✅ Kindly email us your booking details if you haven't received a confirmation email after completing your booking</div> */}
                                            
                                        </div>
                                       
                                    </div>
                                    <div className="mt-6 pt-3">
                                        <div className="p-4 mt-2 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-900">
                                            <h4 className="text-lg font-bold mb-2 text-white">Important Disclaimer</h4>
                                            <p className="text-sm text-white">By purchasing this order you are acknowledging and understanding that receiving a reading should not be used for anything other than entertainment purposes. No legal, no medical questions please. You understand that Marina Smargiannakis is not a doctor and you should seek a medical professional if you need medical attention.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end p-4 bg-gray-100 border-t border-gray-700 rounded-b dark:bg-gray-700">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-gray-700 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                    <button
    // onClick={() => handleBookingRedirect(modalContent.title)}
    type="submit"
    onClick={makePayment}
    className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
    Book Now
</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
                </>
            )}
        </div>
    );
}

export default SameDayCards;
