import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import TestimonialCard from "./TestimonialCard";
import { reviewService } from "../../../Services/api"; // Adjust path as needed
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);
  const targetCount = 20000;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getReviews();
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load testimonials. Please try again later.");
        setLoading(false);
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  // Counter animation
  useEffect(() => {
    const duration = 3000; // 3 seconds for counter animation
    const interval = 30; // Update every 30ms for smooth animation
    const steps = duration / interval;
    const increment = targetCount / steps;

    let currentCount = 0;

    const timer = setInterval(() => {
      currentCount = Math.min(currentCount + increment, targetCount);
      setCount(Math.floor(currentCount));

      if (currentCount >= targetCount) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Format review data for testimonial cards
  const formatReviewForTestimonial = (review) => {
    // Extract user info from the review
    const doctor = review.doctor || {};
    const user = doctor.user || {};

    return {
      profileImage: doctor.profile_picture || null,
      comment: review.comments,
      name: `${doctor.first_name || ""} ${doctor.last_name || ""}`,
      position: doctor.role || "Doctor",
      company: doctor.hospital || "Hospital",
      rating: review.rating || 5,
    };
  };

  // Handle mouse events for carousel
  const handleMouseEnter = (ref) => {
    if (ref.current) {
      ref.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = (ref) => {
    if (ref.current) {
      ref.current.style.animationPlayState = "running";
    }
  };

  // Get reviews for top and bottom rows
  const getTopRowReviews = () => {
    if (reviews.length <= 3) return reviews;
    return reviews.slice(0, Math.ceil(reviews.length / 2));
  };

  const getBottomRowReviews = () => {
    if (reviews.length <= 3) return reviews;
    return reviews.slice(Math.ceil(reviews.length / 2));
  };

  // Get the most recent reviews for mobile view
  const getMostRecentReviews = () => {
    if (reviews.length === 0) return [];
    return [...reviews]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="bg-black text-white py-16 text-center">
        <p className="text-lg font-worksans">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white py-16 text-center">
        <p className="text-lg text-red-500 font-worksans">{error}</p>
      </div>
    );
  }

  // If no reviews, show placeholder
  const placeholderReview = {
    id: "placeholder",
    rating: 5,
    comments:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae et ultricies sapien mauris, urna.",
    doctor: {
      first_name: "Ralph",
      last_name: "Edwards",
      role: "CEO",
      hospital: "Matrixon",
    },
  };

  const displayReviews =
    reviews.length > 0
      ? reviews
      : [placeholderReview, placeholderReview, placeholderReview];
  const topRowTestimonials = getTopRowReviews();
  const bottomRowTestimonials = getBottomRowReviews();
  const recentReviews = getMostRecentReviews();

  // Number of items to ensure smooth infinite loop
  const duplicateCount = Math.max(6, topRowTestimonials.length * 2);

  return (
    <section className="relative bg-black text-white py-24 overflow-hidden">
      {/* Background light effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-amber-100/30 via-amber-100/10 to-transparent rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Counter Section - Above the original content */}
      <div className="container mx-auto px-4 mb-4 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl font-bold font-grotesk">
            <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {count.toLocaleString()}+
            </span>
            <span className="relative px-4 py-2 block text-white">
              <span className="absolute inset-0 -z-10"></span>
              Doctors Recommend
            </span>
          </h1>
        </div>
      </div>

      {/* Original Testimonial Content */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-400 font-worksans text-2xl lg:mb-32">
            Trusted by medical professionals worldwide
          </p>
        </div>

        {displayReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a] border border-[#222] rounded-xl">
            <p className="text-lg text-gray-400 font-worksans">
              No reviews available yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Carousel - Hidden on mobile */}
            <div className="hidden md:block max-w-6xl mx-auto">
              {/* Top row - moves right to left */}
              <div className="relative overflow-hidden mb-8">
                <div
                  ref={topRowRef}
                  className="flex w-[400%]" // Extra width to ensure smooth looping
                  onMouseEnter={() => handleMouseEnter(topRowRef)}
                  onMouseLeave={() => handleMouseLeave(topRowRef)}
                  style={{
                    animation: "carousel-loop-rtl 60s linear infinite",
                  }}
                >
                  {/* Create multiple copies to ensure seamless looping */}
                  {Array(duplicateCount)
                    .fill()
                    .map((_, copyIndex) =>
                      topRowTestimonials.map((review, index) => (
                        <div
                          key={`top-${copyIndex}-${index}`}
                          className="flex-shrink-0 px-4"
                          style={{ width: "400px" }} // Fixed width
                        >
                          <TestimonialCard
                            {...formatReviewForTestimonial(review)}
                          />
                        </div>
                      ))
                    )}
                </div>
              </div>

              {/* Bottom row - moves left to right */}
              <div className="relative overflow-hidden">
                <div
                  ref={bottomRowRef}
                  className="flex w-[400%]" // Extra width to ensure smooth looping
                  onMouseEnter={() => handleMouseEnter(bottomRowRef)}
                  onMouseLeave={() => handleMouseLeave(bottomRowRef)}
                  style={{
                    animation: "carousel-loop-ltr 60s linear infinite",
                  }}
                >
                  {/* Create multiple copies to ensure seamless looping */}
                  {Array(duplicateCount)
                    .fill()
                    .map((_, copyIndex) =>
                      bottomRowTestimonials.map((review, index) => (
                        <div
                          key={`bottom-${copyIndex}-${index}`}
                          className="flex-shrink-0 px-4"
                          style={{ width: "400px" }} // Fixed width
                        >
                          <TestimonialCard
                            {...formatReviewForTestimonial(review)}
                          />
                        </div>
                      ))
                    )}
                </div>
              </div>
            </div>

            {/* Mobile view - stack of 3 most recent reviews */}
            <div className="md:hidden space-y-6">
              {(recentReviews.length > 0
                ? recentReviews
                : displayReviews.slice(0, 3)
              ).map((review, index) => (
                <TestimonialCard
                  key={`mobile-${index}`}
                  {...formatReviewForTestimonial(review)}
                  isMobile={true}
                />
              ))}
            </div>
          </>
        )}
        <div className="relative lg:mt-20 lg:mb-32 lg:w-60 max-w-xl  mx-auto">
          <button
            onClick={() => navigate("/allreviews")}
            className="relative group w-full   py-3 bg-transparent uppercase rounded-full text-gray-100 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 font-space-grotesk text-sm hover:text-gray-600 font-light flex justify-center items-center"
          >
            Check all reviews
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center transition-all duration-300 group-hover:translate-x-1 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300">
                <ArrowRight
                  size={20}
                  className="text-4xl font-bold"
                  // style={{ transform: "rotate(-40deg)" }}
                />
              </div>
            </div>
          </button>
        </div>
      </div>

    

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes carousel-loop-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes carousel-loop-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
      <hr class="relative border-t border-gray-600 opacity-40 before:absolute before:top-1/2 before:left-1/2 before:w-48 before:h-1 before:bg-gradient-to-r before:from-transparent
       before:via-blue-500 before:to-transparent before:blur-md
        before:transform before:-translate-x-1/2 before:-translate-y-1/2" />

    </section>
  );
};

export default Testimonial;
