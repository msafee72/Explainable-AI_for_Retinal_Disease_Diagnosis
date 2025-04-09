// src/components/ReviewForm.jsx
import React, { useState } from 'react';

const ReviewForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [rating, setRating] = useState(initialData.rating || '');
  const [comments, setComments] = useState(initialData.comments || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comments) {
      alert('Please provide both a rating and comments.');
      return;
    }
    onSubmit({ rating: parseInt(rating), comments });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Write your review here..."
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData.id ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;