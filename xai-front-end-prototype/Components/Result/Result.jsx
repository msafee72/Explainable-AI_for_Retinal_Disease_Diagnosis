import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, AlertCircle } from 'lucide-react';

const ResultPage = () => {
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
     // Initialize particles.js when the component mounts
     window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 1000,
          },
        },
        color: {
          value: ["#696969", "#696969"],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.3,
          random: true,
        },
        size: {
          value: 4,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#CCE7FF",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
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
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
     });
   }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Particles container */}
      <div 
        id="particles-js" 
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#F8FBFF] to-[#F0F7FF]"
      />

      {/* Content */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans"
      >
        {/* Header Section */}
        <motion.div 
          variants={fadeIn}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
            Analysis Results
          </h1>
          <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center space-x-2">
            <AlertCircle className="text-blue-500 w-5 h-5" />
            <p className="text-blue-700">Condition Detected: Pneumonia</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Prediction Section */}
          <motion.section 
            variants={fadeIn}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4"
          >
            <h2 className="text-2xl font-semibold font-poppins text-gray-800">Model Prediction</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/images/image.png"
                  alt="Heatmap visualization" 
                  className="rounded-lg w-full object-cover"
                />
              </div>
              
              <div className="space-y-4 mt-3">
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Findings</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Opacity detected in lower right lobe</li>
                    <li>• Moderate infiltration present</li>
                    <li>• No pleural effusion</li>
                  </ul>
                </div>
                
                <button className="w-full ring-1 text-gray-800 rounded-md px-4 py-2 flex items-center justify-center space-x-2 hover:bg-blue-600 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Generate Explainability Report</span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Grad-CAM Visualization */}
          <motion.section 
            variants={fadeIn}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4"
          >
            <h2 className="text-2xl font-semibold font-poppins text-gray-800">Grad-CAM Visualization</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/images/cam.png"
                  alt="Heatmap visualization" 
                  className="rounded-lg w-full object-cover"
                />
              </div>
              
              <div className="space-y-4 mt-3">
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Region Analysis</h3>
                  <p className="text-gray-600">
                    The highlighted areas indicate regions of highest concern. Red zones show the most significant 
                    areas contributing to the model's prediction, with a particular focus on the lower right quadrant.
                  </p>
                </div>
                
                <button className="w-full ring-1 text-gray-800 rounded-md px-4 py-2 flex items-center justify-center space-x-2 hover:bg-blue-600 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Generate Explainability Report</span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Summary Stats */}
          <motion.section 
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-4 text-center">
              <h3 className="text-gray-500 text-sm">Disease Category</h3>
              <p className="text-xl font-semibold mt-1">Respiratory</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-4 text-center">
              <h3 className="text-gray-500 text-sm">Severity Level</h3>
              <p className="text-xl font-semibold mt-1">Moderate</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-4 text-center">
              <h3 className="text-gray-500 text-sm">Prediction Confidence</h3>
              <p className="text-xl font-semibold mt-1">98.5%</p>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;