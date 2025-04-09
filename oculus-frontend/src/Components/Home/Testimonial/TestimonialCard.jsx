import React from 'react';
import { FaStar } from 'react-icons/fa';

const TestimonialCard = ({ profileImage, comment, name, position, company, rating, isMobile = false }) => {
  return (
    <div className={`bg-black mb-10 border-t-0 border-b-0 border border-gray-600  rounded-md overflow-hidden flex flex-col h-full nsition-all duration-300 hover:border-gray-700 ${isMobile ? 'mx-auto max-w-md' : ''}`}>
      <div className="p-6 flex flex-col h-full">
        {/* User info at the top */}
        <div className="flex items-center mb-4">
          {profileImage ? (
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img 
                src={profileImage} 
                alt={`${name}'s profile`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
              <span className="text-gray-200">
                {name ? name.charAt(0) : 'U'}
              </span>
            </div>
          )}
          
          <div>
            <h3 className="font-grotesk  text-gray-200">{name || "Ralph Edwards"}</h3>
            <p className="text-gray-400 font-inter text-sm">{position || "CEO"} @ {company || "Matrixon"}</p>
          </div>
        </div>
        
        {/* Rating stars */}
        <div className="mb-4 text-yellow-500 flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-yellow-500" : "text-gray-600"}
            />
          ))}
        </div>
        
        {/* Testimonial content with overflow handling */}
        <div className="mb-4 flex-grow overflow-auto max-h-32 custom-scrollbar">
          <p className="font-sans text-md text-gray200">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;