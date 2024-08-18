import React, { useState } from "react";
import { deleteReview } from '../../Api/api.js'; // Adjust the path as necessary
import { ToastContainer, toast } from 'react-toastify'; // Assuming you're using react-toastify
import 'react-toastify/dist/ReactToastify.css';
function ManageReviews({ reviews, setReviews }) {
  const [expandedReview, setExpandedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleSeeMore = (index) => {
    setExpandedReview(expandedReview === index ? null : index);
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    console.log("yehi hain:",reviewId)
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };
  

  const handleDelete = async () => {
    try {
      await deleteReview(reviewToDelete); // Call the delete API
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewToDelete));
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      closeDeleteModal(); // Close the modal regardless of success or failure
    }
  };


  return (
    <div>
      <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
        Customer Testimonials
      </div>
      <ToastContainer/>
      <div className="flex flex-wrap justify-center gap-4">
        {reviews.map((review, index) => (
          <div
            key={review._id}
            className="w-full sm:w-80 md:w-96 p-2 transition-all duration-300"
          >
            <div
              className={`relative border rounded-lg dark:bg-gray-800 bg-teal-500 p-4 flex flex-col shadow-lg transition-all duration-300 ${
                expandedReview === index ? "h-auto" : "h-64"
              }`}
            >
              {/* Delete button */}
              <button
                onClick={() => openDeleteModal(review._id)}
                className="absolute top-2 right-2 text-white p-2 rounded-full hover:bg-red-600"
              >
                <ion-icon name="trash" style={{ fontSize: '20px' }}></ion-icon>
              </button>

              <div className="flex items-center mb-3">
                <div className="flex p-1 gap-1 text-yellow-300">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <ion-icon key={i} name="star"></ion-icon>
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, i) => (
                    <ion-icon key={i} name="star-outline"></ion-icon>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between flex-grow">
                <p
                  className={`text-white dark:text-gray-300 ${
                    expandedReview === index ? "" : "line-clamp-4"
                  }`}
                  style={{
                    display: expandedReview === index ? 'block' : '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: expandedReview === index ? 'none' : 4,
                    overflow: expandedReview === index ? 'visible' : 'hidden',
                  }}
                >
                  {review.comments}
                </p>
                <div className="mt-4">
                  {review.comments.length > 100 && (
                    <button
                      className="text-blue-200 hover:underline"
                      onClick={() => handleSeeMore(index)}
                    >
                      {expandedReview === index ? "See Less" : "See More"}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-red-600 text-white">
                    {review.clientName.charAt(0)}
                  </div>
                  <span className="text-white">{review.clientName}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 text-gray-800 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Delete Review</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageReviews;
