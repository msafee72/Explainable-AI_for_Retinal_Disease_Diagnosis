import FeatureSection from "./Feature/FeatureSection";
import { React, useState } from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Testimonial from "./Testimonial/Testimonial";
import { ArrowRight, X } from "lucide-react";
import { LogIn, LogOut, UserPlus, Menu } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { authService } from "../../Services/api";

const AnimatedHeading = () => {
  const [position, setPosition] = useState(0);
  const [isForward, setIsForward] = useState(true);

  const headingText = "AI-Powered\nRetinal Disease\nDiagnosis";

  const subText = "Diagnosing retinal diseases with AI for explainable results";
  const words = subText.split(" ");

  useEffect(() => {
    let timeoutId;
    const totalLength = headingText.length + words.join(" ").length;

    if (isForward && position < totalLength) {
      // Forward animation - normal speed (100ms)
      timeoutId = setTimeout(() => {
        setPosition(position + 1);
      }, 50);
    } else if (isForward && position === totalLength) {
      // Pause at the end before reversing (1000ms)
      timeoutId = setTimeout(() => setIsForward(false), 100);
    } else if (!isForward && position > 0) {
      // Reverse animation - faster speed (30ms)
      timeoutId = setTimeout(() => {
        setPosition(position - 1);
      }, 30);
    } else if (!isForward && position === 0) {
      // Short pause before starting forward again (100ms)
      timeoutId = setTimeout(() => setIsForward(true), 10);
    }

    return () => clearTimeout(timeoutId);
  }, [position, isForward, headingText.length, words]);

  const renderAnimatedText = (text, isHeading = true) => {
    const lines = text.split("\n");
    const currentPos = isHeading
      ? position
      : Math.max(0, position - headingText.length);
    let charCount = 0;

    return lines.map((line, lineIndex) => {
      const chars = line.split("");
      return (
        <div
          key={lineIndex}
          className={`relative ${
            isHeading
              ? "text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              : "text-sm sm:text-base md:text-lg text-gray-600 mt-6 tracking-wide"
          }`}
        >
          {chars.map((char, charIndex) => {
            const isVisible =
              charCount <
              (isHeading
                ? position
                : Math.max(0, position - headingText.length));
            charCount++;
            return (
              <span key={charIndex} className="relative inline-block">
                {isVisible && (
                  <>
                    {charCount ===
                      (isHeading
                        ? position
                        : position - headingText.length) && (
                      <span
                        className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 w-3 h-3 lg:w-8 lg:h-8 rounded-full"
                        style={{
                          background: "#8A929E",
                          animation: "infinite",
                        }}
                      />
                    )}
                    {char}
                  </>
                )}
              </span>
            );
          })}
        </div>
      );
    });
  };

  const renderAnimatedSubText = () => {
    let charCount = headingText.length;
    return (
      <div className="text-sm sm:text-base md:text-lg text-slate-300 mt-6 tracking-wide flex flex-wrap justify-center gap-x-2">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="relative inline-block">
            {word.split("").map((char, charIndex) => {
              const isVisible = charCount < position;
              charCount++;
              return (
                <span key={charIndex} className="relative inline-block">
                  {isVisible && (
                    <>
                      {charCount === position && (
                        <span
                          className="absolute -right-5 lg:-right-8 top-1/2 -translate-y-1/2 w-3 h-3 lg:w-6 lg:h-6 rounded-full"
                          style={{
                            background: "#8A929E",
                            animation: "infinite",
                          }}
                        />
                      )}
                      {char}
                    </>
                  )}
                </span>
              );
            })}{" "}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center text-center px-4 z-20 relative">
      <div className="mb-2">{renderAnimatedText(headingText)}</div>
      {renderAnimatedSubText()}
    </div>
  );
};

const Home = () => {
  const lightRef = useRef(null);
  const particlesRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);

  // Hook to programmatically navigate
  const navigate = useNavigate();

  // Handle click event for the upload button
  const handleClick = () => {
    const user = authService.getCurrentUser(); // Check if user is logged in
    if (user) {
      // If logged in, navigate to the upload page
      navigate("/upload");
    } else {
      // If not logged in, show the modal
      setModalOpen(true);
    }
  };

  //Effect for the right side light
  useEffect(() => {
    const lightElement = lightRef.current;
    if (!lightElement) return;

    lightElement.style.opacity = "0";
    setTimeout(() => {
      lightElement.style.opacity = "1";
      lightElement.style.transition = "opacity 2s ease-in-out";
    }, 500);
  }, []);

  useEffect(() => {
    const particlesContainer = particlesRef.current;
    if (!particlesContainer) return;
  
    particlesContainer.innerHTML = "";
    const particleCount = 300; // Keep the same count
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      
      // Create a narrow horizontal line of particles
      // Uniform distribution for x (horizontal position)
      const x = Math.random() * 100;
      
      // Center of the screen vertically
      const centerY = 50;
      const narrowness = 6; // Very narrow (smaller = narrower)
      
      // Using Box-Muller transform to create normal distribution
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      
      // Apply the normal distribution to create a narrow horizontal line
      const y = centerY + z * narrowness;
      
      const size = Math.random() * 1 + 0.01;
      const opacity = Math.random() * 0.6 + 0.2;
      
      particle.style.position = "absolute";
      particle.style.left = `${x}%`;
      particle.style.top = `${Math.max(0, Math.min(100, y))}%`; // Ensure within bounds
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      particle.style.borderRadius = "50%";
      particle.style.opacity = opacity.toString();
      particle.style.animation = `sparkle ${
        Math.random() * 3 + 2
      }s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      particlesContainer.appendChild(particle);
    }
    
    // Keep the same sparkle animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes sparkle {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.5); }
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);
  return (
    <>
      <div className="relative min-h-screen lg:mb-6 bg-black overflow-hidden font-['Space_Grotesk',_sans-serif] text-center">
        {/* Right side light effect */}
        <div
          ref={lightRef}
          className="absolute top-40 right-0 w-1/2 h-72 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(to left, rgba(31, 41, 55, 1), rgba(156, 163, 175, 1) 16%, rgba(156, 163, 175, 0) 20%)0%",

            opacity: 0,
            filter: "blur(100px)",
          }}
        />
        {/* Background "OCULUS" text with responsive sizes */}
        <div
          className="text-[5rem] sm:text-[10rem] md:text-[15rem] lg:text-[20rem] font-bold text-gray-500 opacity-10 absolute inset-0 flex items-center justify-center select-none pointer-events-none tracking-tighter z-0"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          OCULUS
        </div>
        <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto pt-16 md:pt-24 lg:pt-32 z-10">
          <AnimatedHeading />
        </div>
        {/* check result button  */}
        <div className="relative lg:mt-28 lg:w-96 max-w-xl mx-auto">
          <button
            onClick={handleClick}
            className="relative group w-full px-4 py-3 bg-transparent rounded-full text-gray-100 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 font-space-grotesk text-sm hover:text-gray-600 font-light flex justify-center items-center"
          >
            UPLOAD AND SEE AI GENERATED RESULT
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center transition-all duration-300 group-hover:translate-x-1 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300">
                <ArrowRight
                  size={20}
                  className="text-4xl font-bold"
                 
                />
              </div>
            </div>
          </button>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="relative bg-gray-400 p-8 rounded-lg shadow-lg max-w-lg lg:py-20 lg:px-30 w-full">
              {/* Close Icon */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-gray-900 transition-colors duration-200"
              >
                <X size={24} />
              </button>
              {/* Modal Content */}
              <p className="text-xl font-sans text-gray-700 mb-7">
                Please log in to access our amazing features!
              </p>
              <div className="flex justify-center gap-x-2">
                <Link
                  to="/login"
                  className="relative isolate inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 px-4 py-2 sm:text-sm gap-x-3  border-[--btn-border] hover:bg-gray-300 rounded-full   hover:text-gray-900 transition-colors duration-200"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  ></span>
                  <LogIn size={16} className="mr-2" />
                  LOG IN
                </Link>
                <Link
                  to="/signup"
                  className="relative isolate inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 px-4 py-2 sm:text-sm gap-x-3   border-[--btn-border] hover:bg-gray-300 rounded-full hover:text-gray-900 transition-colors duration-200"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  ></span>
                  <UserPlus size={16} className="mr-2" />
                  SIGN UP
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* check result button  end  */}
        <div className="flex space-x-4 justify-end mr-10 lg:mt-20">
          <Link
            to="upload"
            className="rounded-full bg-transparent border border-gray-600 text-white px-6 py-3 hover:text-gray-800 transition-all duration-300 tracking-wide text-sm"
          >
            BUILD WITH OCULUS
          </Link>
          <Link
            to="allreviews"
            className="rounded-full bg-transparent border border-gray-600 text-white px-6 py-3 hover:text-gray-800  transition-all duration-300 tracking-wide text-sm"
          >
            LEARN MORE
          </Link>
        </div>
        ;{/* Particle container */}
        <div
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none z-10"
        />
        {/* Font import */}
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
        `}</style>
      </div>

      <footer className="absolute bottom-6 left-6 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white animate-bounce opacity-70"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </footer>

      <hr class="relative border-t border-gray-600 opacity-50 before:absolute before:top-1/2 before:left-1/2 before:w-48 before:h-1 before:bg-gradient-to-r before:from-transparent
       before:via-blue-500 before:to-transparent before:blur-md
        before:transform before:-translate-x-1/2 before:-translate-y-1/2" />



      <FeatureSection />
      <Testimonial />
    </>
  );
};

export default Home;
