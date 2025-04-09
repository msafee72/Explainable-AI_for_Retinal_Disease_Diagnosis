import React, { useEffect, useRef } from "react";

const Homepage = () => {
  const lightRef = useRef(null);

  // Animate the light effect with continuous motion
  useEffect(() => {
    const lightElement = lightRef.current;
    if (!lightElement) return;

    let animationFrame;
    let startTime;

    const animateLight = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      // Create a continuous oscillating effect (cycle every 8 seconds)
      const cycle = (elapsedTime % 8000) / 8000;

      // Use sine wave for smooth oscillation (values between 0 and 1)
      const oscillation = (Math.sin(cycle * Math.PI * 2) + 1) / 2;

      // Apply different transformations based on the oscillation
      const xPosition = 85 + oscillation * 5; // Move horizontally between 85% and 90%
      const intensity = 0.25 + oscillation * 0.15; // Vary opacity between 0.25 and 0.4
      const spread = 65 + oscillation * 10; // Vary the spread between 65% and 75%

      // Update the radial gradient properties
      lightElement.style.background = `radial-gradient(circle at ${xPosition}% 50%, rgba(255, 212, 90, ${intensity}) 300%, rgba(0, 0, 0, 0) ${spread}%)`;

      animationFrame = requestAnimationFrame(animateLight);
    };

    animationFrame = requestAnimationFrame(animateLight);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-['Space_Grotesk',_sans-serif]">
      {/* Light effect overlay with continuous motion */}
      <div
        ref={lightRef}
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
      />

      {/* Font import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
      `}</style>

      {/* Navigation */}
      <header className="flex items-center justify-between p-4 md:p-6 z-10 relative">
        <div className="flex items-center">
          <div className="text-white text-3xl font-bold mr-12">
            <span className="text-4xl">X</span>
            <span className="text-xl">I</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition tracking-wider text-sm"
            >
              GROK
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition tracking-wider text-sm"
            >
              API
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition tracking-wider text-sm"
            >
              COMPANY
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition tracking-wider text-sm"
            >
              COLOSSUS
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition tracking-wider text-sm"
            >
              CAREERS
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition tracking-wider text-sm"
            >
              NEWS
            </a>
          </nav>
        </div>
        <div>
          <button className="rounded-full bg-transparent border border-gray-600 text-white px-4 py-2 hover:bg-gray-800 transition font-medium tracking-wide text-sm">
            TRY GROK
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center h-screen px-4 relative z-10">
        <div className="text-[20rem] font-bold text-gray-700 opacity-30 absolute select-none pointer-events-none tracking-tighter">
          Grok
        </div>

        <div className="relative mt-64 w-60 max-w-xl mx-auto">
          <div className="relative group">
            <button
              
              className="w-full px-4 py-4 bg-gray-900/60 backdrop-blur-sm rounded-full text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
            >Check out our result
            </button>
            <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 cursor-pointer flex items-center group-hover:translate-x-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300">
                <span className="transform rotate-[-60deg] inline-block text-xl font-bold">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-white text-center max-w-2xl mt-24">
          <p className="text-xl md:text-2xl font-light tracking-wide">
            We are thrilled to unveil Grok 3, our most advanced model yet,
            <br />
            blending superior reasoning with extensive pretraining knowledge.
          </p>
        </div>

        <div className="flex space-x-4 mt-8">
          <button className="rounded-full bg-transparent border border-gray-600 text-white px-6 py-3 hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide text-sm">
            BUILD WITH GROK
          </button>
          <button className="rounded-full bg-transparent border border-gray-600 text-white px-6 py-3 hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide text-sm">
            LEARN MORE
          </button>
        </div>
      </main>

      {/* Down arrow at bottom */}
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
    </div>
  );
};

export default Homepage;
