import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { motion } from "framer-motion";
import { API_URL } from "../utils/apiConfig";

// const stripePromise = loadStripe(process.env.REACT_APP_API_PUBLIC_KEY);

function SameDayForm() {
  const { id } = useParams(); // Extract the booking ID from the URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking data from the server using the booking ID
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking/${id}`);
        if (response.ok) {
          
          setIsAuthorized(true);
          console.log("user is authorized")
          // You can also set state with booking details here
        } else {
          navigate('/'); // Redirect if booking is not found or unauthorized
        }
      } catch (error) {
        console.error(error);
        navigate('/'); // Redirect on error
      }
    };

    fetchBooking();
  }, [id, navigate]);

  // useEffect(() => {
  //   if (isAuthorized) {
  //     const appointlet = new Appointlet('https://appt.link/meet-with-marina-kLDXzYpH/in-person-meeting');
  //     const inlineEmbed = async () => {
  //       const meetingData = await appointlet.inlineEmbed(document.getElementById('appointlet-embed'));
  //       console.log(meetingData);
  //     };
  //     inlineEmbed();
  //   }
  // }, [isAuthorized]);
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

    return (<section className="h-[100vh]">
  <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
      <div className="lg:col-span-2 lg:py-12">
        <h1 className="text-4xl mb-4 text-white font-bold">Thank you for booking with Marina 🌺!</h1>
        <div className="max-w-xl text-md">
        <ul className="list mt-10 flex flex-col gap-2">
            <li>🌺 Pre-recorded reading: Your reading will be delivered within 24-48 hours.</li>
            <li>🌺 LIVE 45-minute reading: The time slot for your reading will be shared with you via email, based on Marina's best available time.</li>
            <li>🌺 LIVE 45-minute reading: Reading is a first come, first serve within the next few business days(Delivery within 24-72 hours) </li>
            <li>🌺 Ensure that you enter your email address correctly, as all communication will happen through email.</li>
            {/* <li>🌺 Your reading will be provided as a pre-recorded digital file, which will be delivered to your email.</li> */}
            <li>🌺 Filling this form is essential; skipping it may delay your reading.</li>
            </ul>
        </div>

        <div className="mt-8">
          <div className="text-2xl font-bold text-pink-600"> Soulsticetarot143@gmail.com </div>

          <address className="mt-2 not-italic text-white">If you have any questions or concerns, feel free to reach out. Thank you for trusting Marina with your journey! 🌟</address>
        </div>
      </div>

      <div className="rounded-lg p-8 glass-effect shadow-lg lg:col-span-3 lg:p-12">
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
                // required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-2">
            <div>
              <label
                htmlFor="Option1"
                className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-300 hover:border-purple-500 has-[:checked]:border-purple-400 has-[:checked]:bg-purple-500 has-[:checked]:text-white"
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
                // name="option" 
                required />

                <span className="text-sm"> Pre-recorded session ($295)  </span>
              </label>
            </div>

            <div>
              <label
                htmlFor="Option2"
                className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-300 hover:border-purple-500 has-[:checked]:border-purple-400 has-[:checked]:bg-purple-500 has-[:checked]:text-white"
                tabIndex="0"
              >
                <input 
                className="sr-only" 
                id="Option2" 
                type="radio" 
                tabIndex="-1" 
                // name="option" 
                name="readingtype"
                value="Live 45-minute reading ($475)"
                onChange={handleChange}
                required />

                <span className="text-sm"> LIVE 45-minute reading ($475) </span>
              </label>
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="message">Please include any pertinent details and any questions would like to ask.</label>

            <textarea
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              placeholder="Please include any pertinent details and any questions would like to ask."
              rows="8"
              id="message"
              value={formData.message}
                  onChange={handleChange}
                  required
            ></textarea>
          </div>

          <div className="mt-4">
          <button
                  type="submit"
                  className="inline-block w-full rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-3 font-medium text-white sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Details"}
                </button>
          </div>
        </form>
        {responseMessage && (
              <p className="mt-4 text-center text-white">{responseMessage}</p>
            )}
      </div>
    </div>
  </div>
</section>
    );
}

export default SameDayForm;
