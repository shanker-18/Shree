import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface Review {
  id: number;
  product_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productName: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productName }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Form state (no email required)
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.REVIEWS}?productName=${encodeURIComponent(productName)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const data = await response.json();
      // Backward/forward compatible: prefer `data`, then `reviews`
      setReviews(data.data || data.reviews || []);
      setError('');
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productName]);

  // Handle form submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.comment.trim().length < 5) {
      setError('Comment must be at least 5 characters');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(API_ENDPOINTS.REVIEWS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          user_email: user?.email,
          rating: formData.rating,
          comment: formData.comment.trim(),
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status}`);
      }

      // Reset form and refresh reviews
      setFormData({ rating: 5, comment: '' });
      await fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.REVIEWS}/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete review: ${response.status}`);
      }

      // Refresh reviews
      await fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-16 mb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Reviews Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          
          {/* Rating Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="text-4xl font-bold text-indigo-600">{averageRating}</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(Number(averageRating))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
                <p className="text-gray-600 text-sm">
                  {reviews.length === 0 ? 'No reviews yet. Be the first!' : 'Based on customer feedback'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm"
        >
          {user ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Review</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* User Email Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signed in as
                  </label>
                  <p className="text-gray-700 font-medium">{user.email}</p>
                </div>

                {/* Rating Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review (min 5 characters)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Share Your Review</h3>
              <p className="text-gray-600 mb-6">Only registered users can submit reviews. Sign in with your account to share your experience.</p>
              <a
                href="/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Sign In
              </a>
            </div>
          )}
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {/* We no longer require email; show it only if present */}
                      {review.user_email && (
                        <p className="font-medium text-gray-900">{review.user_email}</p>
                      )}
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Show delete button only for user's own reviews */}
                    {user && user.email === review.user_email && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
