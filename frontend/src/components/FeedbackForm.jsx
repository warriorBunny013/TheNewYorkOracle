import React, { useState } from 'react';
import { saveReview } from '../Api/api'; // save review API
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function FeedbackForm() {


  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value, 10));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedbackData = {
      clientName,
      rating,
      comments
    };

    try {
      await saveReview(feedbackData);
      // Reset form fields after successful submission
      setClientName('');
      setRating(0);
      setComments('');
      toast.success('Feedback submitted successfully', {
        autoClose: 2000, // Duration in milliseconds
        containerId:"containerA"
      });
    } catch (error) {
      console.error('Error submitting feedback:');
      toast.error('Failed to submit feedback', {
        autoClose: 2000, // Duration in milliseconds
        containerId:"containerB"
      });
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 "></div>
      

      <div className="flex justify-center relative z-10">
        <div className="flex flex-col justify-center px-4 sm:px-6">
          <div className="my-4 mx-2 text-center flex justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Share Your Experience
            </h2>
          </div>
          <p className="mx-2 sm:mx-4 mb-5 md:mx-6 text-center max-w-[20rem] sm:max-w-[25rem] md:max-w-[35rem] text-gray-300 leading-relaxed text-sm sm:text-base">
            Your feedback helps us create even more magical experiences. We'd love to hear about your journey with us.
          </p>
        </div>
      </div>

      <div className="max-w-[85rem] px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 mx-auto relative z-10">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl lg:max-w-4xl relative">
            <div className="flex flex-col px-2 sm:px-4 md:px-6 lg:px-8">
              <form onSubmit={handleSubmit} className="relative">
                {/* Glassmorphism form container */}
                <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                  <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 lg:gap-8">
                      <div className="flex-1 min-w-0">
                        <label htmlFor="clientName" className="block mb-2 sm:mb-3 text-sm font-medium text-white/90">
                          Your Name
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none text-white placeholder-gray-400 transition-all duration-500 group-hover:border-purple-400/50 focus:border-purple-400 focus:bg-white/10 text-sm sm:text-base"
                            placeholder="Enter your name"
                            required
                          />
                          {/* Glow effect on focus */}
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center sm:justify-between">
                        <div className="rating rating-lg sm:rating-xl my-4 sm:mt-9 flex justify-center sm:justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <input
                              key={star}
                              type="radio"
                              name="rating"
                              value={star}
                              checked={rating === star}
                              onChange={handleRatingChange}
                              className="mask mask-star-2"
                              required
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="comments" className="block mb-2 sm:mb-3 text-sm font-medium text-white/90">
                        Your Review
                      </label>
                      <div className="relative group">
                        <textarea
                          id="comments"
                          name="comments"
                          rows="8"
                          className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none text-white placeholder-gray-400 transition-all duration-500 group-hover:border-purple-400/50 focus:border-purple-400 focus:bg-white/10 resize-none text-sm sm:text-base min-h-[200px]"
                          placeholder="Share your experience with us..."
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          required
                        ></textarea>
                        {/* Glow effect on focus */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <button 
                      type="submit" 
                      className="relative group px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600  to-blue-600 hover:from-purple-500  hover:to-blue-500 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-purple-500/25 text-sm sm:text-base"
                    >
                      <span className="relative z-10">Submit Feedback</span>
                      {/* Button glow effect */}
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </button>
                  </div>
                </div>
              </form>
              <ToastContainer containerId="containerA" limit={1}/>
              <ToastContainer containerId="containerB" limit={1}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
