import React, { useEffect, useState } from "react";
import { reviewService } from "../../Services/api";
import { useAuth } from "../Auth/AuthContext/AuthContext";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";

const ReviewSection = ({ analysisResultId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comments: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getReviewsForAnalysis(analysisResultId);
        setReviews(data);
      } catch (err) {
        setError("Failed to fetch reviews.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [analysisResultId]);

  const handleSubmit = async () => {
    try {
      const reviewData = {
        analysis_result: analysisResultId,
        rating: parseInt(newReview.rating, 10),
        comments: newReview.comments,
      };
      if (editingReviewId) {
        const { analysis_result, ...updateData } = reviewData;
        await reviewService.updateReview(editingReviewId, updateData);
        setEditingReviewId(null);
      } else {
        await reviewService.submitReview(reviewData);
      }
      setNewReview({ rating: 0, comments: "" });
      const updatedReviews = await reviewService.getReviewsForAnalysis(analysisResultId);
      setReviews(updatedReviews);
    } catch (err) {
      setError("Failed to submit review.");
      console.error(err);
    }
  };

  const handleEdit = (review) => {
    setNewReview({ rating: review.rating, comments: review.comments });
    setEditingReviewId(review.id);
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      setError("Failed to delete review.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading reviews...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-4 rounded-lg shadow-sm flex flex-col space-y-2 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </span>
              <span className="text-gray-600 text-sm">
                by Dr. {review.doctor.first_name} {review.doctor.last_name}
              </span>
            </div>
            <p className="text-gray-700">{review.comments}</p>
            {user?.id === review.doctor?.id && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  aria-label="Edit review"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  aria-label="Delete review"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isAuthenticated && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {editingReviewId ? "Edit Review" : "Write a Review"}
          </h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Rating:</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < newReview.rating
                        ? "text-yellow-500 cursor-pointer"
                        : "text-gray-300 cursor-pointer"
                    }
                    onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={newReview.comments}
              onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
              className="w-full p-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your comments here..."
              rows="3"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 w-full sm:w-auto"
            >
              {editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;