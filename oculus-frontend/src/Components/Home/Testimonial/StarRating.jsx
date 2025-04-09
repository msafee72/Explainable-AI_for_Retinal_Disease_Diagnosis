import React from 'react';
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1 my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#FFD700" : "none"}
          color={star <= rating ? "#FFD700" : "#D1D5DB"}
        />
      ))}
    </div>
  );
};
export default StarRating;