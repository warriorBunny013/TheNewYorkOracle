import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../utils/apiConfig';

function NewsletterPopup() {

  const [email, setEmail] = useState('');
  // const [message, setMessage] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    // setMessage(''); // Reset message

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // setMessage('Successfully subscribed!');
        toast('Successfully subscribed!');
        setEmail(''); // Clear the input field
      } else {
        // setMessage('Subscription failed. Please try again.');
        toast('Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      // setMessage('An error occurred. Please try again later.');
      toast('An error occurred. Please try again later.');
    }
  };
  return (
    <div>
      <section className="bg-white mt-40 pb-20 bg-black-variation">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <motion.div
            initial={{ opacity: 0,y:100}}
            whileInView={{ opacity:1 ,y:0 }}
            transition={{ duration: 1, ease: "easeInOut" }}

           
            className="mx-auto max-w-screen-md sm:text-center"
          >
            <img
              className="flex mx-auto max-w-[15rem] lg:max-w-md"
              src="https://i.postimg.cc/NFy9qjgS/Group-1991.png"
              alt="logo"
            />
            <p className="mx-auto mb-2 mt-8 max-w-2xl text-white md:mb-12">
              Don't miss out! Subscribe to our FREE newsletter for the latest updates.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                <div className="relative w-full">
                  <label
                    htmlFor="email"
                    className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Email address
                  </label>
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter your email"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">
                Don't worry we care about the protection of your data.
              </div>
            </form>
            {/* {message && (
              <div className="mt-4 text-sm text-center text-red-700">{message}</div>
            )} */}
            <ToastContainer/>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default NewsletterPopup;
