import React, { useEffect } from "react";
import { motion } from "framer-motion"; // Importing framer-motion for motion
import FeatureSection from "./Feature/FeatureSection";
import FileUpload from "./FileUpload/FileUpload";
import { Link } from "react-router-dom";


export default function Home() {
  useEffect(() => {
    // Initialize particles.js when the component mounts
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: ["#696969", "#696969"], // Light black color for particles
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: true,
        },
        size: {
          value: 5,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#08ABE0", // Light black color (hex: #696969)
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse", // Repulsion effect
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 300,
            size: 2, // Reduced bubble size
            duration: 2,
            opacity: 8,
            speed: 3,
            color: "#699BFE", // Light black color for bubble
          },
          repulse: {
            distance: 50, // Reduced repulsion distance
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-4 h-96 ">
        {/* Left Part */}
        <div className="col-span-6 flex-col space-y-3  justify-center">
          <motion.div
            className="text-lg text-gray-700 font-sans mt-32 text-center px-3"
            initial={{ opacity: 0, x: -100 }} // Starts from the right (x: 100)
            animate={{ opacity: 1, x: 0 }} // Moves to its normal position (x: 0)
            transition={{ duration: 1 }} // Adjust the duration of the animation
          >
            <h1 className="text-4xl font-bold text-black mb-3 ">
              AI-Powered Retinal Disease Diagnosis
            </h1>

            <p className="text-xl text-gray-600 text-justify px-6 ml-5">
              Diagnosing retinal diseases with AI for explainable results.
            </p>
          </motion.div>
          <div className="flex justify-center space-x-3">
            <Link to="/login" className="button">Join Us Now</Link>
            <Link to="/demo" className="button">Request Demo</Link>
          </div>
        </div>

        <div className="col-span-6 relative">
          <img
            src="/images/u.png"
            loading="lazy"
            alt="Blue Waves"
            className="w-full object-contain"
          />

          <div id="particles-js" className="absolute inset-0"></div>
        </div>
      </div>

      <FeatureSection/>

      <FileUpload/>
    </>
  );
}
