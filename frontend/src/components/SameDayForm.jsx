import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from "../utils/apiConfig";

// const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

function SameDayForm() {
  const { id } = useParams(); // Extract the booking ID from the URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking data from the server using the booking ID
    const fetchBooking = async () => {
      try {
        const response = await fetch(`${API_URL}/api/booking/${id}`);
        if (response.ok) {
          setIsAuthorized(true);
          // User is authorized
          // You can also set state with booking details here
        } else {
          navigate('/'); // Redirect if booking is not found or unauthorized
        }
      } catch (error) {
        console.error(error);
        navigate('/'); // Redirect on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        readingtype: "", // New field for session option
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [responseMessage, setResponseMessage] = useState("");
      const handleChange = (e) => {
        const { id, value, type, name } = e.target;
        // setFormData({ ...formData, [e.target.id]: e.target.value });
        if (type === "radio") {
          setFormData({ ...formData, [name]: value }); // Handle radio input
        } else {
          setFormData({ ...formData, [id]: value });
        }
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
          // const response = await fetch(`${API_URL}/api/prices`);
          // const data = await response.json();
          // setPrices(data);
          const response = await fetch(`${API_URL}/sendemail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const result = await response.json();
          if (result.success) {
            setResponseMessage("Your details have been sent successfully!");
            setIsCompleted(true);
            setFormData({ name: "", email: "", phone: "", message: "" ,readingtype: "" });
          } else {
            setResponseMessage("Failed to send your details. Please try again.");
          }
        } catch (error) {
            setResponseMessage("An error occurred. Please try again later.");
    }
    setIsSubmitting(false);
  };        

  
  if (!isAuthorized) {
    return <p>Unauthorized access. Please complete a payment first.</p>;
  }

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Verifying your booking...</h2>
          <p className="text-pink-200 text-sm sm:text-base">Please wait while we confirm your payment</p>
        </div>
      </section>
    );
  }

  if (isCompleted) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl mb-4 text-white font-bold">Booking Complete! 🌺</h1>
              <p className="text-lg sm:text-xl text-green-300 mb-6">Thank you for completing your booking with Marina!</p>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">What happens next?</h2>
              <ul className="text-left space-y-3 text-white text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>You'll receive a confirmation email with your booking details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Marina will review your information and get back to you within 5-7 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>For live readings, you'll receive scheduling information via email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>For pre-recorded readings, your reading will be delivered to your email</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => window.location.href = '/'}
                className="inline-block rounded-lg bg-violet-600 hover:bg-violet-500 px-6 sm:px-8 py-3 font-medium text-white transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

    return (<section className="min-h-screen">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-5">
      <div className="lg:col-span-2 lg:py-12">
        <h1 className="text-3xl sm:text-4xl mb-4 text-white font-bold">Thank you for booking with Marina 🌺!</h1>
        
        {/* Important Notice */}
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-yellow-300 font-bold text-base sm:text-lg mb-2">⚠️ IMPORTANT: Complete Your Booking</h3>
          <p className="text-yellow-200 text-sm">This form is required to process your reading. Please fill out all details below.</p>
        </div>
        
        <div className="max-w-xl text-sm sm:text-md">
        <ul className="list mt-6 sm:mt-10 flex flex-col gap-2">
            <li>🌺 Pre-recorded reading: Your reading will be delivered within 24-72 hours.</li>
            <li>🌺 LIVE 45-minute reading: The time slot for your reading will be shared with you via email, based on Marina's best available time.</li>
            <li>🌺 LIVE 45-minute reading: Reading is a first come, first serve within the next few business days(Delivery within 24-72 hours) </li>
            <li>🌺 Ensure that you enter your email address correctly, as all communication will happen through email.</li>
            {/* <li>🌺 Your reading will be provided as a pre-recorded digital file, which will be delivered to your email.</li> */}
            <li>🌺 Filling this form is essential; skipping it may delay your reading.</li>
            </ul>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="text-xl sm:text-2xl font-bold text-pink-600"> info@soulsticetarot.com </div>

          <address className="mt-2 not-italic text-white text-sm sm:text-base">If you have any questions or concerns, feel free to reach out. Thank you for trusting Marina with your journey! 🌟</address>
        </div>
      </div>

      <div className="rounded-lg p-6 sm:p-8 glass-effect shadow-lg lg:col-span-3 lg:p-12 border border-pink-500/20">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Complete Your Booking Details</h2>
          <p className="text-pink-200 text-sm sm:text-base">Please provide your information to receive your reading</p>
        </div>
        
        <form  onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="name">Name</label>
            <input
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              id="name"
              required
              disabled={isCompleted}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                className="w-full rounded-lg border-gray-200 p-3 text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                type="email"
                id="email"
                required
                disabled={isCompleted}
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="phone">Phone</label>
              <input
                className="w-full rounded-lg border-gray-200 p-3 text-sm"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                id="phone"
                disabled={isCompleted}
                // required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
            <div>
              <label
                htmlFor="Option1"
                className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-300 hover:border-purple-500 has-[:checked]:border-purple-400 has-[:checked]:bg-purple-500 has-[:checked]:text-white text-sm"
                tabIndex="0"
              >
                <input 
                className="sr-only" 
                id="Option1" 
                type="radio" 
                tabIndex="-1" 
                name="readingtype"
                value="Pre-recorded session ($295)"
                onChange={handleChange}
                disabled={isCompleted}
                // name="option" 
                required />

                <span className="text-xs sm:text-sm"> Pre-recorded session ($295)  </span>
              </label>
            </div>

            <div>
              <label
                htmlFor="Option2"
                className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-300 hover:border-purple-500 has-[:checked]:border-purple-400 has-[:checked]:bg-purple-500 has-[:checked]:text-white text-sm"
                tabIndex="0"
              >
                <input 
                className="sr-only" 
                id="Option2" 
                type="radio" 
                tabIndex="-1" 
                // name="option" 
                name="readingtype"
                value="Live 45mins one-on-one reading ($475)"
                onChange={handleChange}
                disabled={isCompleted}
                required />

                <span className="text-xs sm:text-sm"> Live 45mins one-on-one reading ($475) </span>
              </label>
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="message">Please include any pertinent details and any questions would like to ask.</label>

            <textarea
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              placeholder="Please include any pertinent details and any questions would like to ask."
              rows="6"
              id="message"
              value={formData.message}
                  onChange={handleChange}
                  disabled={isCompleted}
                  required
            ></textarea>
          </div>

          <div className="mt-6">
          <button
                  type="submit"
                  className="inline-block w-full rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-3 font-medium text-white sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isCompleted}
                >
                  {isSubmitting ? "Sending..." : isCompleted ? "Booking Completed" : "Complete Booking"}
                </button>
          </div>
        </form>
        {responseMessage && (
              <div className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                <p className="text-center text-green-300 text-sm sm:text-base">{responseMessage}</p>
              </div>
            )}
      </div>
    </div>
  </div>
</section>
    );
}

export default SameDayForm;

