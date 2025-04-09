import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import { reviewService } from '../../../Services/api'; // Adjust path as needed

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getReviews();
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reviews. Please try again later.');
        setLoading(false);
        console.error('Error fetching reviews:', err);
      }
    };

    fetchAllReviews();
  }, []);

  // Format review data for testimonial cards (same as in Testimonials component)
  const formatReviewForTestimonial = (review) => {
    const doctor = review.doctor || {};
    const user = doctor.user || {};
    
    return {
      profileImage: doctor.profile_picture || null,
      comment: review.comments,
      name: `${doctor.first_name || ''} ${doctor.last_name || ''}`,
      position: doctor.role || 'Doctor',
      company: doctor.hospital || 'Hospital',
      rating: review.rating || 5
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex  items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-inter text-gray-300 animate-pulse text-sm sm:text-base">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex  items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-400 font-inter text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-3 lg:mt-20 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-grotesk text-white">All Reviews</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-xl text-gray-300 font-inter">See what our users have to say</p>
        </div>
        
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 font-inter text-sm sm:text-base">No reviews available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {reviews.map((review, index) => (
              <TestimonialCard
                key={review.id || index}
                {...formatReviewForTestimonial(review)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;