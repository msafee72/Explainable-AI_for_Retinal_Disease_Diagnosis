import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
  linkText,
  linkTo,
}) {
  const particlesRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const particlesContainer = particlesRef.current;
    const card = cardRef.current;
    if (!particlesContainer || !card) return;
    
    const createParticles = () => {
      particlesContainer.innerHTML = "";
      const particleCount = 80;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        
        // More particles on the right, gradually decreasing towards left
        const rightBias = Math.pow(Math.random(), 2);
        const x = 39 + rightBias * 60;
        const y = Math.random() * 60;
        const size = Math.random() * 1 + 1;
        const opacity = Math.random() * 0.6 + 0.2;
        
        particle.style.position = "absolute";
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = "rgba(255, 255, 0, 0.8)";
        particle.style.borderRadius = "50%";
        particle.style.opacity = opacity.toString();
        particle.style.animation = `sparkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        particlesContainer.appendChild(particle);
      }
    };

    // Create particles only when hovering
    const handleMouseEnter = () => {
      createParticles();
    };

    const handleMouseLeave = () => {
      particlesContainer.innerHTML = "";
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes sparkle {
        0%, 100% {
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.5);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      ref={cardRef}
      className="group lg:mb-10 relative flex-1 bg-black border-x h-full border-gray-900 p-14 transition-all duration-300 ease-in-out z-10"
    >
      {/* Vertical border lines (slightly faded) */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gray-700/20"></div>
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gray-700/20"></div>
      
      {/* Particle container */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        ref={particlesRef}
      />

      {/* Corner dots that appear on hover */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon - now centered */}
      <div className="flex justify-center items-center w-16 h-24  mx-auto ">
        <Icon className= "text-9xl" />
      </div>

      {/* Content - aligned with the design */}
      <div className="space-y-3">
        <h3
          className="text-xl font-bold text-white font-grotesk  sm:text-xl text-center"
         
        >
          {title}
        </h3>
        <p
          className="text-xl  font-inter text-gray-300 uppercase text-yellow-400  sm:text-md text-center"
         
        >
          {subtitle}
        </p>
        <p
          className="text-gray-200 font-dmsans  sm:text-lg  text-center"
          
        >
          {description}
        </p>
      </div>

      {/* Link Button */}
      
   
    </div>
  );
}