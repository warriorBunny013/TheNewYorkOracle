import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trash2, 
  MessageSquare, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { deleteReview } from '../../Api/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageReviews({ reviews, setReviews }) {
  const [expandedReview, setExpandedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const handleSeeMore = (index) => {
    setExpandedReview(expandedReview === index ? null : index);
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await deleteReview(reviewToDelete);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewToDelete));
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
    } finally {
      closeDeleteModal();
    }
  };

  // Filter reviews based on search and rating
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comments?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    recent: reviews.filter(r => new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Customer Testimonials</h1>
          <p className="text-gray-400 mt-1">Manage and moderate customer reviews</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">{stats.averageRating}</span>
          <span>average rating</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Reviews</p>
              <p className="text-white font-bold text-xl">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">5-Star Reviews</p>
              <p className="text-white font-bold text-xl">{stats.fiveStar}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">This Week</p>
              <p className="text-white font-bold text-xl">{stats.recent}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white font-bold text-xl">{filteredReviews.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300 group"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {review.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{review.clientName}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => openDeleteModal(review._id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Review Content */}
              <div className="space-y-4">
                <p className={`text-gray-300 leading-relaxed ${
                  expandedReview === index ? '' : 'line-clamp-3'
                }`}>
                  {review.comments}
                </p>
                
                {review.comments.length > 150 && (
                  <button
                    onClick={() => handleSeeMore(index)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    {expandedReview === index ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show More
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Review Footer */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-gray-700/50 rounded-full">
                    {review.rating}/5 stars
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <MessageSquare className="w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No reviews found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl border border-gray-700/50 p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Delete Review</h2>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this review? This action will permanently remove it from your system.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}

export default ManageReviews;
