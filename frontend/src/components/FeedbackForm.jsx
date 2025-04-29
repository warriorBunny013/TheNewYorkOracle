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
    <div 
    
    >
      <div className="flex my-10 mt-20 justify-center">
        <div className="flex flex-col justify-center">
          <div className="mt-20 my-4 mx-2 text-center flex justify-center lg:ml-20 text-4xl font-bold tracking-tight text-white dark:text-white">Send your feedback</div>
          <p className="mx-6 text-center max-w-[35rem] text-gray-300">Please feel free to share any specific feedback about your reading experience. Your comments will help us improve our services.</p>
        </div>
      </div>
      <div className="max-w-[85rem] px-2 py-2 sm:px-4 lg:px-4 lg:py-2 mx-auto">
        <div className="flex justify-center">
          <div className="w-[100vh] relative">
            <div className="flex flex-col px-4 sm:px-6 lg:px-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 lg:gap-10">
                  <div className="flex flex-wrap justify-between gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="clientName" className="block mb-2 text-sm text-white">Your name</label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full block lg:w-[50vh] py-3 px-4 bg-white/5 border border-gray-700 rounded-lg focus:outline-none text-white placeholder-gray-400 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="rating my-7 rating-lg">
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
                    <label htmlFor="comments" className="block mb-2 text-sm text-white">Review</label>
                    <textarea
                      id="comments"
                      name="comments"
                      rows="4"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full py-3 px-4 bg-white/5 border border-gray-700 rounded-lg focus:outline-none text-white placeholder-gray-400 transition-all duration-300"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button type="submit" className="btn px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2">Submit</button>
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
