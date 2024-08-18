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
      toast('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast('Failed to submit feedback');
    }
  };

  return (
    <div 
    
    >
      <div className="flex my-10 mt-20 justify-center">
        <div className="flex flex-col justify-center">
          <div className="mt-20 my-4 mx-2 text-center flex justify-center lg:ml-20 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Send your feedback</div>
          <p className="mx-6 text-center max-w-[35rem]">Please feel free to share any specific feedback about your reading experience. Your comments will help us improve our services.</p>
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
                        className="py-3 px-4 block w-[50vh] border-gray-200 rounded-lg text-black bg-white"
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
                      className="py-3 px-4 block w-full lg:h-[15rem] border-gray-200 rounded-lg text-black bg-white"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button type="submit" className="btn text-white px-10 bg-[#5E3BEE] btn-primary">Submit</button>
                </div>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default FeedbackForm;
